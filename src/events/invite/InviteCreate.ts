import { Invite } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class InviteCreateEvent extends BaseEvent {
    constructor() {
        super('inviteCreate');
    }
    
    async run(invite: Invite) {
        if(!client.isOnline) return;
        if(!invite.guild) return
        // const guildConfig = await Guilds.config.get(invite.guild.id);
        // const logChannel = (invite.guild as Guild).channels.cache.find(channel => channel.id === guildConfig.get('logs.invites'));
        // if(!logChannel) return;
        // const language = guildConfig.get('language');

        // inviteCreatedLog(client, invite.url, invite.expiresTimestamp, invite.inviter, invite.maxUses, invite.channel.id, logChannel, language);
    }
};
