import { ThreadChannel } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";
import { getAuditLog } from "../../utils/utils";

export default class ThreadDeleteEvent extends BaseEvent {
    constructor() {
        super('threadDelete');
    }
    
    async run(thread: ThreadChannel) {

        serverLogs(thread)
    }
}

async function serverLogs(thread: ThreadChannel) {
    const log = await getAuditLog(thread.guild, 'THREAD_DELETE', (log) => (log.target.id === thread.id))
    if(!log || !log.executor) return

    Logs.log('threads', 'delete', thread.guildId, { thread, customs: { moderatorMention: `<@${log.executor.id}>`, moderatorId: log.executor.id } })
}