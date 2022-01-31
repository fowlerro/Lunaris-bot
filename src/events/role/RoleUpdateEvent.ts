// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate
import { AuditLogChange, BitField, Formatters, Permissions, PermissionString, Role } from "discord.js";
import { Language } from "types";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

export default class RoleUpdateEvent extends BaseEvent {
	constructor() {
		super('roleUpdate');
	}
	
	async run(oldRole: Role, newRole: Role) {
		if(!client.isOnline) return;

		
		console.log({ oldRole, newRole })
		serverLogs(oldRole, newRole)
	}
}

async function serverLogs(oldRole: Role, newRole: Role) {
    if(!newRole.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
    const auditLogs = await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const roleLog = auditLogs.entries.find(log => log.target?.id === newRole.id && Date.now() - log.createdTimestamp < 5000)
    if(!roleLog) return
    const language = newRole.guild.preferredLocale === 'pl' ? 'pl' : 'en'

    const { executor, changes } = roleLog
    if(!executor) return
    if(!changes) return

	const roleEdits = registerEdits(changes, language)

    Logs.log('roles', 'edit', newRole.guild.id, { role: newRole, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id, roleEdits: roleEdits || t('general.none', language) } })
}

function registerEdits(changes: AuditLogChange[], language: Language) {
    let edits = ''
    if(changes.find(c => c.key === 'color')) edits += editColor(changes, language)
    if(changes.find(c => c.key === 'name')) edits += editName(changes, language)
    if(changes.find(c => c.key === 'hoist')) edits += editHoist(changes, language)
    if(changes.find(c => c.key === 'mentionable')) edits += editMention(changes, language)
    if(changes.find(c => c.key === 'permissions')) edits += editPerms(changes, language)

    return edits
}

function editColor(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'color')
    if(!change) return ''
    const oldColor = change.old?.toString(16)
    const newColor = change.new?.toString(16)

    return `**${t('logs.roles.edit.changes.color', language)}**: \`#${oldColor?.toUpperCase()}\` => \`#${newColor?.toUpperCase()}\`\n`
}

export function editName(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'name')
    if(!change) return ''
    const oldName = change.old
    const newName = change.new

    return `**${t('logs.roles.edit.changes.name', language)}**: \`${oldName}\` => \`${newName}\`\n`
}

function editHoist(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'hoist')
    if(!change) return ''
    const newValue = change.new ? t('general.yes', language) : t('general.no', language)

    return `**${t('logs.roles.edit.changes.hoist', language)}**: \`${newValue}\`\n`
}

function editMention(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'mentionable')
    if(!change) return ''
    const newValue = change.new ? t('general.yes', language) : t('general.no', language)

    return `**${t('logs.roles.edit.changes.mentionable', language)}**: \`${newValue}\`\n`
}

function editPerms(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'permissions')
    if(!change) return ''
    const oldValue = change.old as any
    const newValue = change.new as any
    const oldPerms = new Permissions(oldValue).serialize()
    const newPerms = new Permissions(newValue).serialize()
    const changedPerms = Object.fromEntries(Object.entries(newPerms).filter(([key, value]) => value !== oldPerms[key as PermissionString]))

    const allowPerms = Object.keys(changedPerms).filter(key => changedPerms[key as PermissionString] === true).map(value => t(`permissions.${value}` as any, language))
    const denyPerms = Object.keys(changedPerms).filter(key => changedPerms[key as PermissionString] === false).map(value => t(`permissions.${value}` as any, language))

    const allowEdit = allowPerms.length ? `**${t('logs.roles.edit.changes.allowPermissions', language)}**: ${allowPerms.join(', ')}\n` : ""
    const denyEdit = denyPerms.length ? `**${t('logs.roles.edit.changes.denyPermissions', language)}**: ${denyPerms.join(', ')}\n` : ""

    return allowEdit + denyEdit
}