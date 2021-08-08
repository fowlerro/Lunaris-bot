const GuildConfig = require('../../database/schemas/GuildConfig');
const { inviteDeletedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('inviteDelete');
    }
    
    async run(client, invite) {
        if(!client.isOnline) return;
        
        const guildConfig = client.guildConfigs.get(invite.guild.id);
        const logChannel = invite.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.invites'));
        if(!logChannel) return;
        const language = guildConfig.get('language');

        inviteDeletedLog(client, invite.code, invite.channel.id, logChannel, language);
    }
};
