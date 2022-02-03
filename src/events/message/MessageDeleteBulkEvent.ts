import { Collection, Message, Snowflake } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { getAuditLog, getLocale } from "../../utils/utils"

export default class MessageDeleteBulkEvent extends BaseEvent {
    constructor() {
        super('messageDeleteBulk')
    }
    
    async run(messages: Collection<Snowflake, Message>) {
        if(!client.isOnline) return
        serverLogs(messages)
    }
}

async function serverLogs(messages: Collection<Snowflake, Message>) {
    const guild = messages.first()?.guild
    if(!guild) return
    const language = getLocale(guild.preferredLocale)

    const log = await getAuditLog(guild, 'MESSAGE_BULK_DELETE', (log) => (
        log.extra.count === messages.size &&
        log.target.id === messages.first()?.channelId
    ))
    if(!log || !log.executor) return

    const { executor, extra, reason, target } = log
    
    Logs.log('messages', 'purge', guild.id, { 
        customs: { 
            deletedByMention: `<@${executor.id}>`,
            deletedById: executor.id,
            mentionMessageChannel: `<#${target.id}>`,
            purgeCount: extra.count,
            reason: reason || t('general.none', language)
        } 
    })
}