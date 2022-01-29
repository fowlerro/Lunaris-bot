// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
import { Message, Permissions } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { sleep } from "../../utils/utils";

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
	if(!message.guildId) return
	if(!message.guild?.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
	await sleep(500)
	const auditLogs = await message.guild?.fetchAuditLogs({ type: 'MESSAGE_DELETE', limit: 5 }).catch(console.error)
	if(!auditLogs) return

	const messageLog = auditLogs.entries.find(log => log.target.id === message.author.id && log.extra.channel.id === message.channelId && Date.now() - log.createdTimestamp < 5000)
	const deletedById = messageLog?.executor?.id || message.author.id

	Logs.log('messages', 'delete', message.guildId, { message, customs: { deletedByMention: `<@${deletedById}>`, deletedById } })
}