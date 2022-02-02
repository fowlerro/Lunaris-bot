// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildChannel } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { getAuditLog } from "../../utils/utils"

export default class ChannelCreateEvent extends BaseEvent {
	constructor() {
		super('channelCreate')
	}
	
	async run(channel: GuildChannel) {
		if(!client.isOnline) return
		serverLogs(channel)
	}
}

async function serverLogs(channel: GuildChannel) {
    const channelLog = await getAuditLog(channel.guild, 'CHANNEL_CREATE', (log) => (log.target.id === channel.id))
    if(!channelLog) return

    const { executor } = channelLog
    if(!executor) return

    Logs.log('channels', 'create', channel.guildId, { channel, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}