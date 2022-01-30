// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildEmoji } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"

export default class EmojiUpdateEvent extends BaseEvent {
	constructor() {
		super('emojiUpdate')
	}
	
	async run(emoji: GuildEmoji) {
		if(!client.isOnline) return

		serverLogs(emoji)
	}
}

async function serverLogs(emoji: GuildEmoji) {
    // Logs.log('emojis', 'create', emoji.guild.id, { emoji })
}