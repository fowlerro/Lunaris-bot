// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
import { DMChannel, GuildChannel } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { getAuditLog } from "../../utils/utils";


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
    const channelLog = await getAuditLog(channel.guild, 'CHANNEL_DELETE', (log) => (log.target.id === channel.id))
    if(!channelLog) return

    const { executor } = channelLog
    if(!executor) return

    Logs.log('channels', 'delete', channel.guildId, { channel, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}