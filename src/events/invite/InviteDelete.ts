import { Invite } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
export default class InviteDeleteEvent extends BaseEvent {
    constructor() {
        super('inviteDelete');
    }
    
    async run(invite: Invite) {
        if(!client.isOnline) return;
        if(!invite.guild) return
        // const guildConfig = await Guilds.config.get(client, invite.guild.id);
        // const logChannel = (invite.guild as Guild).channels.cache.find(channel => channel.id === guildConfig.get('logs.invites'));
        // if(!logChannel) return;
        // const language = guildConfig.get('language');

        // inviteDeletedLog(client, invite.code, invite.channel.id, logChannel, language);
    }
};
