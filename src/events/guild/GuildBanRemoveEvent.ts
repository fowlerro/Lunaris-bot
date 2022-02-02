// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
import { GuildBan } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { getLocale, sleep } from "../../utils/utils";

export default class GuildBanRemoveEvent extends BaseEvent {
	constructor() {
		super('guildBanRemove');
	}
  
	async run(ban: GuildBan) {
		if(!client.isOnline) return;
		logs(ban)
	}
}

async function logs(ban: GuildBan) {
	await sleep(500)
	const language = getLocale(ban.guild.preferredLocale)
	const auditLogs = await ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE', limit: 1 }).catch(e => console.log(e))
	if(!auditLogs) return
	const unbanLog = auditLogs.entries.first()
	if(!unbanLog) return
	
	const { executor, target } = unbanLog
	if(!executor || !target || target.id !== ban.user.id) return
	if(executor.id === client.user?.id) return

	Logs.log('members', 'unban', ban.guild.id, { member: ban.user, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id, reason: ban.reason || t('general.none', language) } })
}