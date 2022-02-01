// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildEmoji, Permissions } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { sleep } from "../../utils/utils"

export default class EmojiDeleteEvent extends BaseEvent {
	constructor() {
		super('emojiDelete')
	}
	
	async run(emoji: GuildEmoji) {
		if(!client.isOnline) return
		serverLogs(emoji)
	}
}

async function serverLogs(emoji: GuildEmoji) {
    if(!emoji.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
    const auditLogs = await emoji.guild.fetchAuditLogs({ type: 'EMOJI_DELETE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const log = auditLogs.entries.find(log => log.target?.id === emoji.id && Date.now() - log.createdTimestamp < 5000)
    if(!log || !log.executor) return
    
    Logs.log('emojis', 'delete', emoji.guild.id, { emoji, customs: { moderatorMention: `<@${log.executor.id}>`, moderatorId: log.executor.id} })
}