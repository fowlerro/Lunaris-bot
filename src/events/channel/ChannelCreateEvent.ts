// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { DMChannel, GuildChannel, Permissions } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

export default class ChannelCreateEvent extends BaseEvent {
	constructor() {
		super('channelCreate');
	}
	
	async run(channel: GuildChannel) {
		if(!client.isOnline) return;
		serverLogs(channel)
	}
}

async function serverLogs(channel: GuildChannel) {
    if(!channel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
    const auditLogs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const channelLog = auditLogs.entries.find(log => log.target.id === channel.id && Date.now() - log.createdTimestamp < 5000)
    if(!channelLog) return

    const { executor } = channelLog
    if(!executor) return

    Logs.log('channels', 'create', channel.guildId, { channel, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}