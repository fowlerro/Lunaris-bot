// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember, Permissions } from 'discord.js'
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