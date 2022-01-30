import { Invite } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class InviteCreateEvent extends BaseEvent {
    constructor() {
        super('inviteCreate');
    }
    
    async run(invite: Invite) {
        if(!client.isOnline) return;
        if(!invite.guild) return

        serverLogs(invite)
    }
};

async function serverLogs(invite: Invite) {
    if(!invite.guild) return
    
    Logs.log('invites', 'create', invite.guild.id, { invite })
}
