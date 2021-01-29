const GuildConfig = require('../../database/schemas/GuildConfig');
const { inviteDeletedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('inviteDelete');
    }
    
    async run(client, invite) {
        const guildConfig = await GuildConfig.findOne({guildID: invite.guild.id}).catch();
        const logChannel = invite.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.invites'));
        const language = guildConfig.get('language');
        if(!logChannel) return;

        inviteDeletedLog(client, invite.code, invite.channel.id, logChannel, language);
    }
};
