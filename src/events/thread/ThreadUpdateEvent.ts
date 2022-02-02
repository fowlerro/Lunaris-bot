import { AuditLogChange, Permissions, ThreadChannel } from "discord.js";
import { Language } from "types";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { getAuditLog, getLocale, sleep } from "../../utils/utils";
import { editArchive, editSlowmode } from "../channel/ChannelUpdateEvent";
import { editName } from "../role/RoleUpdateEvent";

export default class ThreadUpdateEvent extends BaseEvent {
    constructor() {
        super('threadUpdate');
    }
    
    async run(oldThread: ThreadChannel, newThread: ThreadChannel) {
        serverLogs(newThread)
    }
};

async function serverLogs(newThread: ThreadChannel) {
    const language = getLocale(newThread.guild.preferredLocale)
    
    const log = await getAuditLog(newThread.guild, 'THREAD_UPDATE', (log) => (log.target.id === newThread.id))
    if(!log) return

    const { executor, changes } = log
    if(!executor || !changes) return
    const edits = registerEdits(changes, language)

    Logs.log('threads', 'edit', newThread.guildId, { thread: newThread, customs: { editorMention: `<@${executor.id}>`, editorId: executor.id, threadEdits: edits } })
}


function registerEdits(changes: AuditLogChange[], language: Language) {
    let edits = ''
    if(changes.find(c => c.key === 'name')) edits += editName(changes, language)
    if(changes.find(c => c.key === 'rate_limit_per_user')) edits += editSlowmode(changes, language)
    if(changes.find(c => c.key === 'default_auto_archive_duration')) edits += editArchive(changes, language)
    if(changes.find(c => c.key === 'locked')) edits += editLocked(changes, language)

    return edits
}


function editLocked(changes: AuditLogChange[], language: Language) {
    const change = changes.find(change => change.key === 'locked')
    if(!change) return ''
    const newValue = change.new ? t('general.yes', language) : t('general.no', language)

    return `**${t('logs.threads.edit.changes.locked', language)}**: \`${newValue}\`\n`
}