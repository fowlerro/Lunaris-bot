// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
import { GuildEmoji, Permissions } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { sleep } from "../../utils/utils"

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
    if(!newEmoji.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return

    await sleep(500)
    const auditLogs = await newEmoji.guild.fetchAuditLogs({ type: 'EMOJI_UPDATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const log = auditLogs.entries.find(log => log.target?.id === newEmoji.id && Date.now() - log.createdTimestamp < 5000)
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