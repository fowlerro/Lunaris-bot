// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { GuildMember } from "discord.js";
import Logs from "../../modules/Logs";
import WelcomeMessage from "../../modules/WelcomeMessage";

import BaseEvent from "../../utils/structures/BaseEvent";
import { getAuditLog, getLocale, sleep } from "../../utils/utils";

export default class GuildMemberRemoveEvent extends BaseEvent {
	constructor() {
		super('guildMemberRemove');
	}
  
	async run(member: GuildMember) {
		if(!client.isOnline) return
		
		WelcomeMessage.sendMessage(member, 'leave')
		serverLogs(member)	
	}
}

async function serverLogs(member: GuildMember) {
    const language = getLocale(member.guild.preferredLocale)
	await sleep(500)
	const { kicked, kickExecutor, kickReason } = await isKicked(member)
	if(kicked && kickExecutor) return Logs.log('members', 'kick', member.guild.id, { member, customs: { moderatorMention: `<@${kickExecutor.id}>`, moderatorId: kickExecutor.id, reason: kickReason || t('general.none', language) } })

    const { banned, banExecutor, banReason } = await isBanned(member)
	if(banned && banExecutor && (banExecutor.id !== client.user?.id)) return Logs.log('members', 'ban', member.guild.id, { member, customs: { moderatorMention: `<@${banExecutor.id}>`, moderatorId: banExecutor.id,  reason: banReason || t('general.none', language), unbanDate: t('general.never', language), unbanDateR: " " }}) 

    const memberRoles = member.roles.cache.filter(role => role.name !== '@everyone').map(role => `<@&${role.id}>`)
    if(!kicked && !banned) return Logs.log('members', 'leave', member.guild.id, { member, customs: { memberRoles: memberRoles.length ? memberRoles.join(', ') : t('general.none', language) } })
}

async function isKicked(member: GuildMember) {
    const log = await getAuditLog(member.guild, 'MEMBER_KICK', (log) => (log.target?.id === member.id), true)
    if(!log || !log.executor) return { kicked: false }

	const { executor, reason } = log
	if(member.joinedAt && (log.createdAt < member.joinedAt)) return { kicked: false }

	return { kicked: true, kickExecutor: executor, kickReason: reason }
}

async function isBanned(member: GuildMember) {
    const log = await getAuditLog(member.guild, 'MEMBER_BAN_ADD', (log) => (log.target?.id === member.id))
    if(!log || !log.executor) return { banned: false }

	const { executor, reason } = log
	if(member.joinedAt && (log.createdAt < member.joinedAt)) return { banned: false }

	return { banned: true, banExecutor: executor, banReason: reason }
}