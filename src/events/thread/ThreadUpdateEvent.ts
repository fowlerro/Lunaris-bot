import { AuditLogChange, Permissions, ThreadChannel } from "discord.js";
import { Language } from "types";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { getLocale, sleep } from "../../utils/utils";
import { editArchive, editSlowmode } from "../channel/ChannelUpdateEvent";
import { editName } from "../role/RoleUpdateEvent";

export default class ThreadUpdateEvent extends BaseEvent {
    constructor() {
        super('threadUpdate');
    }
    
    async run(oldThread: ThreadChannel, newThread: ThreadChannel) {

        serverLogs(oldThread, newThread)
    }
};

async function serverLogs(oldThread: ThreadChannel, newThread: ThreadChannel) {
    if(!newThread.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return
    await sleep(500)
    const language = getLocale(newThread.guild.preferredLocale)
    const auditLogs = await newThread.guild.fetchAuditLogs({ type: 'THREAD_UPDATE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const log = await auditLogs.entries.find(log => log.target.id === newThread.id && Date.now() - log.createdTimestamp < 5000)
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