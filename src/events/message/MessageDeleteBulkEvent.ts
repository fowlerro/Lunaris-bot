import { Collection, Message, Snowflake } from "discord.js"
import Logs from "../../modules/Logs"

import BaseEvent from "../../utils/structures/BaseEvent"
import { sleep } from "../../utils/utils"

export default class MessageDeleteBulkEvent extends BaseEvent {
    constructor() {
        super('messageDeleteBulk')
    }
    
    async run(messages: Collection<Snowflake, Message>) {
        if(!client.isOnline) return
        console.log('bulk')
        serverLogs(messages)
    }
}

async function serverLogs(messages: Collection<Snowflake, Message>) {
    const guild = messages.first()?.guild
    if(!guild) return
    console.log('guild')
    const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'
    await sleep(500)
    const auditLogs = await messages.first()?.guild?.fetchAuditLogs({ type: 'MESSAGE_BULK_DELETE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    console.log('auditLogs', auditLogs.entries.first())
    console.log(messages.size, messages.first())
    const log = auditLogs.entries.find(log => 
        log.extra.count === messages.size &&
        log.target.id === messages.first()?.channelId &&
        Date.now() - log.createdTimestamp < 5000
    )
    if(!log || !log.executor) return
    console.log('log')
    const { executor, extra, reason, target } = log
    console.log({ target })
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