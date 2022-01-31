// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelUpdate
import { AuditLogChange, DMChannel, GuildAuditLogsEntry, GuildChannel, Permissions, Snowflake } from "discord.js";
import { Language } from "types";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";
import { editName } from "../role/RoleUpdateEvent";


export default class ChannelUpdateEvent extends BaseEvent {
    constructor() {
        super('channelUpdate');
    }
    
    async run(oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
        if(!client.isOnline) return;
        if(oldChannel.type === 'DM' || newChannel.type === 'DM') return

        serverLogs(oldChannel, newChannel)
    }
}

async function serverLogs(oldChannel: GuildChannel, newChannel: GuildChannel) {
    if(!newChannel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)

    const updateLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 5 }).catch(console.error)
    if(updateLogs) {
        const updateLog = updateLogs.entries.find(log => log.target.id === newChannel.id && Date.now() - log.createdTimestamp < 5000)
        if(updateLog) return channelUpdateLog(oldChannel, newChannel, updateLog)
    }

    let moderatorId: Snowflake | null = null

    const overwriteLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_OVERWRITE_UPDATE', limit: 5 }).catch(console.error)
    if(overwriteLogs) {
        const overwriteLog = overwriteLogs.entries.find(log => log.target.id === newChannel.id && Date.now() - log.createdTimestamp < 5000)
        if(overwriteLog) moderatorId = overwriteLog.executor?.id || null
    }

    return channelOverwriteLog(oldChannel, newChannel, moderatorId)
}

async function channelUpdateLog(oldChannel: GuildChannel, newChannel: GuildChannel, auditLog: GuildAuditLogsEntry<"CHANNEL_UPDATE", "CHANNEL_UPDATE", "UPDATE", "CHANNEL">) {
    const language = newChannel.guild.preferredLocale === 'pl' ? 'pl' : 'en'
    const { executor, changes } = auditLog
    if(!executor || !changes) return
    const edits = registerEdits(changes, language)

    Logs.log('channels', 'edit', newChannel.guildId, { channel: newChannel, customs: { moderator: `<@${executor.id}>\n\`${executor.id}\``, channelEdits: edits } })
}

async function channelOverwriteLog(oldChannel: GuildChannel, newChannel: GuildChannel, moderatorId: Snowflake | null) {
    const language = newChannel.guild.preferredLocale === 'pl' ? 'pl' : 'en'

    const moderator = moderatorId ? `<@${moderatorId}>\n\`${moderatorId}\`` : t('general.unknown', language)
    const oldPerms = oldChannel.permissionOverwrites.cache.map(value => ({ id: value.id, deny: value.deny.toArray(), allow: value.allow.toArray() }))
    const newPerms = newChannel.permissionOverwrites.cache.map(value => ({ id: value.id, deny: value.deny.toArray(), allow: value.allow.toArray() }))

    const changes = newPerms
        .filter(perm => {
            const oldPerm = oldPerms.find(value => value.id === perm.id)
            if(!oldPerm) return true
            if(perm.allow.length !== oldPerm.allow.length) return true
            if(perm.deny.length !== oldPerm.deny.length) return true

            if(!perm.allow.every(value => oldPerm.allow.includes(value))) return true
            if(!perm.deny.every(value => oldPerm.deny.includes(value))) return true

            return false
        })
        .map(perm => ({ 
            id: perm.id,
            deny: perm.deny.filter(value => !oldPerms.find(old => old.id === perm.id)?.deny.includes(value)),
            allow: perm.allow.filter(value => !oldPerms.find(old => old.id === perm.id)?.allow.includes(value)),
            default: oldPerms.find(value => value.id === perm.id)?.deny.filter(val => !perm.deny.includes(val) && !perm.allow.includes(val)).concat(
                oldPerms.find(value => value.id === perm.id)?.allow.filter(val => !perm.deny.includes(val) && !perm.allow.includes(val)) || []
            ) || []
        }))

    let edits = changes.map(perm => {
        let edit = ''
        if(perm.allow.length) edit += `**${t('logs.channels.edit.allowed', language)}**: ${perm.allow.map(value => t(`permissions.${value}` as any, language)).join(', ')}\n`
        if(perm.default.length) edit += `**${t('logs.channels.edit.default', language)}**: ${perm.default.map(value => t(`permissions.${value}` as any, language)).join(', ')}\n`
        if(perm.deny.length) edit += `**${t('logs.channels.edit.denied', language)}**: ${perm.deny.map(value => t(`permissions.${value}` as any, language)).join(', ')}\n`

        if(!edit) return ''
        return `<@&${perm.id}>\n${edit}`
    }).join('\n')

    if(!edits) return

    Logs.log('channels', 'edit', newChannel.guildId, { channel: newChannel, customs: { moderator, channelEdits: edits } })
}

function registerEdits(changes: AuditLogChange[], language: Language) {
    let edits = ''
    if(changes.find(c => c.key === 'name')) edits += editName(changes, language)
    if(changes.find(c => c.key === 'topic')) edits += editTopic(changes, language)
    if(changes.find(c => c.key === 'rate_limit_per_user')) edits += editSlowmode(changes, language)
    if(changes.find(c => c.key === 'nsfw')) edits += editNsfw(changes, language)
    if(changes.find(c => c.key === 'type')) edits += editType(changes, language)
    if(changes.find(c => c.key === 'default_auto_archive_duration')) edits += editArchive(changes, language)

    return edits
}

function editTopic(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'topic')
    if(!change) return ''
    const oldValue = change.old || t('general.none', language)
    const newValue = change.new || t('general.none', language)

    return `**${t('logs.channels.edit.changes.topic', language)}**:
        ${t('general.before', language)}: ${oldValue}
        ${t('general.after', language)}: ${newValue}\n\n`
}

export function editSlowmode(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'rate_limit_per_user')
    if(!change) return ''
    const oldValue = change.old ? change.old + 's' : t('general.off', language)
    const newValue = change.new ? change.new + 's' : t('general.off', language)

    return `**${t('logs.channels.edit.changes.slowmode', language)}**: \`${oldValue}\` => \`${newValue}\`\n`
}

function editNsfw(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'nsfw')
    if(!change) return ''
    const newValue = change.new ? t('general.yes', language) : t('general.no', language)

    return `**${t('logs.channels.edit.changes.nsfw', language)}**: \`${newValue}\`\n`
}

function editType(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'type')
    if(!change) return ''
    const newValue = change.new === 5 ? t('general.yes', language) : t('general.no', language)

    return `**${t('logs.channels.edit.changes.announcement', language)}**: \`${newValue}\`\n`
}

export function editArchive(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'default_auto_archive_duration')
    if(!change) return ''
    const oldValue = change.old ? change.old + 'min' : t('general.none', language)
    const newValue = change.new ? change.new + 'min' : t('general.none', language)

    return `**${t('logs.channels.edit.changes.archive', language)}**: \`${oldValue}\` => \`${newValue}\`\n`
}