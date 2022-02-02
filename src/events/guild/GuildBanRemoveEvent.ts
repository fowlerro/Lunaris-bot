// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
import { GuildBan } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { getAuditLog, getLocale } from "../../utils/utils";

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
	const language = getLocale(ban.guild.preferredLocale)

    const log = await getAuditLog(ban.guild, 'MEMBER_BAN_REMOVE', (log) => (log.target?.id === ban.user.id))
    if(!log || !log.executor) return
	
	const { executor } = log
	if(executor.id === client.user?.id) return

	Logs.log('members', 'unban', ban.guild.id, { member: ban.user, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id, reason: ban.reason || t('general.none', language) } })
}