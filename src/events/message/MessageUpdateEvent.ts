// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { getAuditLog } from "../../utils/utils";

export default class MessageUpdateEvent extends BaseEvent {
	constructor() {
		super('messageUpdate');
	}
	
	async run(oldMessage: Message, newMessage: Message) {
		if(!client.isOnline) return;
		if(!newMessage.guild || newMessage.author.bot) return;
		
		serverLogs(oldMessage, newMessage)
	}
}

async function serverLogs(oldMessage: Message, newMessage: Message) {
	if(oldMessage.content !== newMessage.content) editMessageLog(oldMessage, newMessage)
	if(oldMessage.pinned === false && newMessage.pinned === true) pinMessageLog(newMessage)
	if(oldMessage.pinned === true && newMessage.pinned === false) unpinMessageLog(newMessage)
}

async function editMessageLog(oldMessage: Message, newMessage: Message) {
	if(!newMessage.guild) return 

	Logs.log('messages', 'edit', newMessage.guild.id, { message: newMessage, customs: { messageContentBefore: oldMessage.content, messageContentAfter: newMessage.content } })
}

async function pinMessageLog(newMessage: Message) {
	if(!newMessage.guild) return
    const log = await getAuditLog(newMessage.guild, 'MESSAGE_PIN', (log) => (log.extra.messageId === newMessage.id))
    if(!log || !log.executor) return

	Logs.log('messages', 'pin', newMessage.guild.id, { message: newMessage, customs: { moderatorMention: `<@${log.executor.id}>`, moderatorId: log.executor.id } })
}

async function unpinMessageLog(newMessage: Message) {
	if(!newMessage.guild) return
    const log = await getAuditLog(newMessage.guild, 'MESSAGE_UNPIN', (log) => (log.extra.messageId === newMessage.id))
    if(!log || !log.executor) return

	Logs.log('messages', 'unpin', newMessage.guild.id, { message: newMessage, customs: { moderatorMention: `<@${log.executor.id}>`, moderatorId: log.executor.id } })
}
