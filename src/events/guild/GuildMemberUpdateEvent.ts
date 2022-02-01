// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { AuditLogChange, Formatters, GuildMember, Permissions, User } from 'discord.js'
import Logs from '../../modules/Logs';

import BaseEvent from '../../utils/structures/BaseEvent';
import { sleep } from '../../utils/utils';

export default class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(oldMember: GuildMember, newMember: GuildMember) {
    if(!client.isOnline) return;

    serverLogs(oldMember, newMember)
  }
}

async function serverLogs(oldMember: GuildMember, newMember: GuildMember) {
	if(!newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return

	if(oldMember.roles.cache.size < newMember.roles.cache.size) addRoleLog(newMember)
	if(oldMember.roles.cache.size > newMember.roles.cache.size) removeRoleLog(newMember)

    memberUpdateLog(newMember)
}

async function memberUpdateLog(newMember: GuildMember) {
    await sleep(500)
    const auditLogs = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const log = auditLogs.entries.find(log => log.target?.id === newMember.id && Date.now() - log.createdTimestamp < 5000)
    if(!log) return
    const { executor, target, changes, reason } = log
    if(!executor || !target || !changes) return

    const nickChange = changes.find(change => change.key === 'nick')
    const timeoutChange = changes.find(change => change.key === 'communication_disabled_until')
    
    if(nickChange) nicknameLog(newMember, executor, nickChange)
    if(timeoutChange && timeoutChange.new) timeoutLog(newMember, executor, timeoutChange, reason)
    if(timeoutChange && !timeoutChange.new) timeoutRemoveLog(newMember, executor, reason)
}

async function addRoleLog(newMember: GuildMember) {
	await sleep(500)
	const auditLog = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', limit: 1 }).catch((e) => console.error(e))
	if(!auditLog) return
	const addRoleLog = auditLog.entries.first()
	if(!addRoleLog) return

	const { executor, target, changes } = addRoleLog
	const addedRole = changes?.find(change => change.key === '$add')?.new
	if(!addedRole || !executor || !target) return
	if(!Array.isArray(addedRole) || !('name' in addedRole[0])) return

	Logs.log('roles', 'add', newMember.guild.id, { member: newMember, role: addedRole[0], customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}

async function removeRoleLog(newMember: GuildMember) {
	await sleep(500)
	const auditLog = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', limit: 1 }).catch(e => console.error(e))
	if(!auditLog) return
	const removeRoleLog = auditLog.entries.first()
	if(!removeRoleLog) return

	const { executor, target, changes } = removeRoleLog
	const removedRole = changes?.find(change => change.key === '$remove')?.new
	if(!removedRole || !executor || !target) return
	if(!Array.isArray(removedRole) || !('name' in removedRole[0])) return

	Logs.log('roles', 'remove', newMember.guild.id, { member: newMember, role: removedRole[0], customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}

async function nicknameLog(newMember: GuildMember, executor: User, change: AuditLogChange) {
    if(change.old === change.new) return
    const language = newMember.guild.preferredLocale === 'pl' ? 'pl' : 'en'
    const oldNickname = change.old || t('general.none', language)
    const newNickname = change.new || t('general.none', language)

    Logs.log('members', 'nicknameChange', newMember.guild.id, { 
        member: newMember, 
        customs: {
            editorMention: `<@${executor.id}>`,
            editorId: executor.id,
            oldNickname,
            newNickname
        }
    })
}

async function timeoutLog(newMember: GuildMember, executor: User, change: AuditLogChange, reason: string | null) {
    if(!change.new || typeof change.new !== 'string') return
    const language = newMember.guild.preferredLocale === 'pl' ? 'pl' : 'en'

    const timeoutDate = new Date(change.new)

    Logs.log('members', 'timeout', newMember.guild.id, {
        member: newMember,
        customs: {
            moderatorMention: `<@${executor.id}>`,
            moderatorId: executor.id,
            timeoutDate: Formatters.time(timeoutDate),
            timeoutDateR: Formatters.time(timeoutDate, 'R'),
            reason: reason || t('general.none', language)
        }
    })
}

async function timeoutRemoveLog(newMember: GuildMember, executor: User, reason: string | null) {
    const language = newMember.guild.preferredLocale === 'pl' ? 'pl' : 'en'

    Logs.log('members', 'timeoutRemove', newMember.guild.id, {
        member: newMember,
        customs: {
            moderatorMention: `<@${executor.id}>`,
            moderatorId: executor.id,
            reason: reason || t('general.none', language)
        }
    })
}