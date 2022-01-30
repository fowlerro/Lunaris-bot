// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
import { DMChannel, GuildChannel, Permissions } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";


export default class ChannelDeleteEvent extends BaseEvent {
    constructor() {
        super('channelDelete');
    }
    
    async run(channel: DMChannel | GuildChannel) {
        if(!client.isOnline) return;
        if(channel.type === 'DM') return

        serverLogs(channel)
    }
}

async function serverLogs(channel: GuildChannel) {
    if(!channel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
    const auditLogs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const channelLog = auditLogs.entries.find(log => log.target.id === channel.id && Date.now() - log.createdTimestamp < 5000)
    if(!channelLog) return

    const { executor } = channelLog
    if(!executor) return

    Logs.log('channels', 'delete', channel.guildId, { channel, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}