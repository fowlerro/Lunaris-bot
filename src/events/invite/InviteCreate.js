const { inviteCreatedLog } = require('../../modules/guildLogs');
const Guilds = require('../../modules/Guilds');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('inviteCreate');
    }
    
    async run(client, invite) {
        if(!client.isOnline) return;
        
        const guildConfig = await Guilds.config.get(client, invite.guild.id);
        const logChannel = invite.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.invites'));
        if(!logChannel) return;
        const language = guildConfig.get('language');

        inviteCreatedLog(client, invite.url, invite.expiresTimestamp, invite.inviter, invite.maxUses, invite.channel.id, logChannel, language);
    }
};
