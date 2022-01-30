// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
import { Message, Permissions } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

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
	if(oldMessage.pinned === false && newMessage.pinned === true) pinMessageLog(oldMessage, newMessage)
	if(oldMessage.pinned === true && newMessage.pinned === false) unpinMessageLog(oldMessage, newMessage)
}

async function editMessageLog(oldMessage: Message, newMessage: Message) {
	if(!newMessage.guild) return 

	Logs.log('messages', 'edit', newMessage.guild.id, { message: newMessage, customs: { messageContentBefore: oldMessage.content, messageContentAfter: newMessage.content } })
}

async function pinMessageLog(oldMessage: Message, newMessage: Message) {
	if(!newMessage.guild) return
	if(!newMessage.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
	const auditLogs = await newMessage.guild.fetchAuditLogs({ type: 'MESSAGE_PIN', limit: 5 }).catch(console.error)
	if(!auditLogs) return

	const pinLog = auditLogs.entries.find(log => log.extra.messageId === newMessage.id && Date.now() - log.createdTimestamp < 5000)
	if(!pinLog || !pinLog.executor) return

	Logs.log('messages', 'pin', newMessage.guild.id, { message: newMessage, customs: { moderatorMention: `<@${pinLog.executor.id}>`, moderatorId: pinLog.executor.id } })
}

async function unpinMessageLog(oldMessage: Message, newMessage: Message) {
	if(!newMessage.guild) return
	if(!newMessage.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
	const auditLogs = await newMessage.guild.fetchAuditLogs({ type: 'MESSAGE_UNPIN', limit: 5 }).catch(console.error)
	if(!auditLogs) return

	const pinLog = auditLogs.entries.find(log => log.extra.messageId === newMessage.id && Date.now() - log.createdTimestamp < 5000)
	if(!pinLog || !pinLog.executor) return

	Logs.log('messages', 'unpin', newMessage.guild.id, { message: newMessage, customs: { moderatorMention: `<@${pinLog.executor.id}>`, moderatorId: pinLog.executor.id } })
}
