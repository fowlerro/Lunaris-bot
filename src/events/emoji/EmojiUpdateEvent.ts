// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildEmoji } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { getAuditLog } from "../../utils/utils"

export default class EmojiUpdateEvent extends BaseEvent {
	constructor() {
		super('emojiUpdate')
	}
	
	async run(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
		if(!client.isOnline) return

		serverLogs(oldEmoji, newEmoji)
	}
}

async function serverLogs(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
    if(oldEmoji.name === newEmoji.name) return
    
    const log = await getAuditLog(newEmoji.guild, 'EMOJI_UPDATE', (log) => (log.target?.id === newEmoji.id))
    if(!log || !log.executor) return

    newEmoji.author = await newEmoji.fetchAuthor()

    Logs.log('emojis', 'edit', newEmoji.guild.id, { 
        emoji: newEmoji,
        customs: {
            moderatorMention: `<@${log.executor.id}>`,
            moderatorId: log.executor.id,
            emojiOldName: oldEmoji.name,
            emojiNewName: newEmoji.name
        } 
    })
}