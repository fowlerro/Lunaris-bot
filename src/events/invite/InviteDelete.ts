import { Invite, Permissions } from "discord.js"
import Logs from "../../modules/Logs"

import BaseEvent from "../../utils/structures/BaseEvent"
import { getAuditLog, sleep } from "../../utils/utils"
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
    
    const log = await getAuditLog(guild, 'INVITE_DELETE', (log) => (log.target.code === invite.code))
    if(!log || !log.executor) return

    Logs.log('invites', 'delete', guild.id, { invite: log.target, customs: { deletedByMention: `<@${log.executor.id}>`, deletedById: log.executor.id } })
}