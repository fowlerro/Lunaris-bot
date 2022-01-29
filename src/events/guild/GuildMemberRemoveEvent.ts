// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { GuildMember } from "discord.js";
import Logs from "../../modules/Logs";
import WelcomeMessage from "../../modules/WelcomeMessage";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

export default class GuildMemberRemoveEvent extends BaseEvent {
	constructor() {
		super('guildMemberRemove');
	}
  
	async run(member: GuildMember) {
		if(!client.isOnline) return
		
		WelcomeMessage.sendMessage(member, 'leave')
		logs(member)	
	}
}

async function logs(member: GuildMember) {
    const language = member.guild.preferredLocale === 'pl' ? 'pl' : 'en'
	await sleep(500)
	const { kicked, kickExecutor, kickReason } = await isKicked(member)
	if(kicked && kickExecutor) return Logs.log('members', 'kick', member.guild.id, { member, customs: { moderatorMention: `<@${kickExecutor.id}>`, moderatorId: kickExecutor.id, reason: kickReason || t('general.none', language) } })

    const { banned, banExecutor, banReason } = await isBanned(member)
	if(banned && banExecutor && (banExecutor.id !== client.user?.id)) return Logs.log('members', 'ban', member.guild.id, { member, customs: { moderatorMention: `<@${banExecutor.id}>`, moderatorId: banExecutor.id,  reason: banReason || t('general.none', language), unbanDate: t('general.never', language), unbanDateR: " " }}) 

    if(!kicked && !banned) return Logs.log('members', 'leave', member.guild.id, { member, customs: { memberRoles: member.roles.cache.filter(role => role.name !== 'everyone').map(role => `<@&${role.id}>`) } })
}

async function isKicked(member: GuildMember) {
	const auditLogs = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).catch(e => console.log(e))
	if(!auditLogs) return { kicked: false }
	const kickLog = auditLogs.entries.first()
	if(!kickLog) return { kicked: false }

	const { executor, target, reason } = kickLog
	if(!target || target.id !== member.id) return { kicked: false }
	if(member.joinedAt && (kickLog.createdAt < member.joinedAt)) return { kicked: false }

	return { kicked: true, kickExecutor: executor, kickReason: reason }
}

async function isBanned(member: GuildMember) {
	const auditLogs = await member.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD', limit: 1 }).catch(e => console.log(e))
	if(!auditLogs) return { banned: false }
	const banLog = auditLogs.entries.first()
	if(!banLog) return { banned: false }

	const { executor, target, reason } = banLog
	if(!target || target.id !== member.id) return { banned: false }
	if(member.joinedAt && (banLog.createdAt < member.joinedAt)) return { banned: false }

	return { banned: true, banExecutor: executor, banReason: reason }
}