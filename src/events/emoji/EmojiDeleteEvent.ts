// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildEmoji } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { getAuditLog } from "../../utils/utils"

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
    const log = await getAuditLog(emoji.guild, 'EMOJI_DELETE', (log) => (log.target?.id === emoji.id))
    if(!log || !log.executor) return
    
    Logs.log('emojis', 'delete', emoji.guild.id, { emoji, customs: { moderatorMention: `<@${log.executor.id}>`, moderatorId: log.executor.id} })
}