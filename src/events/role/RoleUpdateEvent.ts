// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate
import { AuditLogChange, Permissions, PermissionString, Role } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { getAuditLog, getLocale } from "../../utils/utils";
import type { Language } from "types";

export default class RoleUpdateEvent extends BaseEvent {
	constructor() {
		super('roleUpdate');
	}
	
	async run(oldRole: Role, newRole: Role) {
		if(!client.isOnline) return;

		serverLogs(newRole)
	}
}

async function serverLogs(newRole: Role) {
    const log = await getAuditLog(newRole.guild, 'ROLE_UPDATE', (log) => (log.target?.id === newRole.id))
    if(!log) return
    
    const language = getLocale(newRole.guild.preferredLocale)

    const { executor, changes } = log
    if(!executor || !changes) return

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