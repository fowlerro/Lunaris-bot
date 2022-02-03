// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { getAuditLog } from "../../utils/utils";

export default class MessageDeleteEvent extends BaseEvent {
	constructor() {
		super('messageDelete');
	}
	
	async run(message: Message) {
		if(!client.isOnline) return;
		if(!message.guild || message.author.bot) return;

		serverLogs(message)
	}
}

async function serverLogs(message: Message) {
	if(!message.guild) return
    const log = await getAuditLog(message.guild, 'MESSAGE_DELETE', (log) => (
        log.target.id === message.author.id &&
        log.extra.channel.id === message.channelId
    ))
    if(!log) return

	const deletedById = log?.executor?.id || message.author.id

	Logs.log('messages', 'delete', message.guild.id, { message, customs: { deletedByMention: `<@${deletedById}>`, deletedById } })
}