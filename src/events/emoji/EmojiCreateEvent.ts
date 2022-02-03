// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildEmoji } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"

export default class EmojiCreatedEvent extends BaseEvent {
	constructor() {
		super('emojiCreate')
	}
	
	async run(emoji: GuildEmoji) {
		if(!client.isOnline) return
		serverLogs(emoji)
	}
}

async function serverLogs(emoji: GuildEmoji) {
    emoji.author = await emoji.fetchAuthor().catch(logger.error) || null
    if(!emoji.author) return
    Logs.log('emojis', 'create', emoji.guild.id, { emoji })
}