import { Invite } from "discord.js"

import BaseEvent from "../../utils/structures/BaseEvent"
import Logs from "../../modules/Logs"
import { getAuditLog } from "../../utils/utils"
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
    const guild = await invite.guild?.fetch().catch(logger.error)
    if(!guild) return
    
    const log = await getAuditLog(guild, 'INVITE_DELETE', (log) => (log.target.code === invite.code))
    if(!log || !log.executor) return

    Logs.log('invites', 'delete', guild.id, { invite: log.target, customs: { deletedByMention: `<@${log.executor.id}>`, deletedById: log.executor.id } })
}