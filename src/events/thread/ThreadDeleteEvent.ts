import { ThreadChannel } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

export default class ThreadDeleteEvent extends BaseEvent {
    constructor() {
        super('threadDelete');
    }
    
    async run(thread: ThreadChannel) {

        serverLogs(thread)
    }
}

async function serverLogs(thread: ThreadChannel) {
    await sleep(500)
    const auditLogs = await thread.guild.fetchAuditLogs({ type: 'THREAD_DELETE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const log = auditLogs.entries.find(log => log.target.id === thread.id && Date.now() - log.createdTimestamp < 5000)
    if(!log || !log.executor) return
    const { executor } = log

    Logs.log('threads', 'delete', thread.guildId, { thread, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}