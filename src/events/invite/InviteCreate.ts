import { Invite } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";

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
