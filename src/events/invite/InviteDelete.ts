import { Invite, Permissions } from "discord.js"
import Logs from "../../modules/Logs"

import BaseEvent from "../../utils/structures/BaseEvent"
import { sleep } from "../../utils/utils"
export default class InviteDeleteEvent extends BaseEvent {
    constructor() {
        super('inviteDelete')
    }
    
    async run(invite: Invite) {
        if(!client.isOnline) return
        if(!invite.guild) return
        
        serverLogs(invite)
    }
}

async function serverLogs(invite: Invite) {
    const guild = await invite.guild?.fetch().catch(console.error)
    if(!guild) return
    if(!guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return

    await sleep(500)
    const auditLogs = await guild.fetchAuditLogs({ type: 'INVITE_DELETE', limit: 5 }).catch(console.error)
    if(!auditLogs) return
    const log = auditLogs.entries.find(log => log.target.code === invite.code && Date.now() - log.createdTimestamp < 5000)
    if(!log || !log.executor) return
    Logs.log('invites', 'delete', guild.id, { invite: log.target, customs: { deletedByMention: `<@${log.executor.id}>`, deletedById: log.executor.id } })
}