// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelUpdate
import { DMChannel, GuildChannel, Permissions } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";


export default class ChannelUpdateEvent extends BaseEvent {
    constructor() {
        super('channelUpdate');
    }
    
    async run(oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
        if(!client.isOnline) return;
        if(oldChannel.type === 'DM' || newChannel.type === 'DM') return

        // serverLogs(oldChannel, newChannel)
    }
}

async function serverLogs(oldChannel: GuildChannel, newChannel: GuildChannel) {
    if(!newChannel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
    channelUpdateLog(oldChannel, newChannel)
    channelOverrideLog(oldChannel, newChannel)
}

async function channelUpdateLog(oldChannel: GuildChannel, newChannel: GuildChannel) {
    const auditLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const channelLog = auditLogs.entries.find(log => log.target.id === newChannel.id && Date.now() - log.createdTimestamp < 5000)
    if(!channelLog) return

    const { executor } = channelLog
    if(!executor) return
    console.log(channelLog)
    // Logs.log('channels', 'delete', channel.guildId, { channel, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}

async function channelOverrideLog(oldChannel: GuildChannel, newChannel: GuildChannel) {
    const auditLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_OVERWRITE_UPDATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const channelLog = auditLogs.entries.find(log => log.target.id === newChannel.id && Date.now() - log.createdTimestamp < 5000)
    if(!channelLog) return

    const { executor } = channelLog
    if(!executor) return
    console.log(channelLog)
    // Logs.log('channels', 'delete', channel.guildId, { channel, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}