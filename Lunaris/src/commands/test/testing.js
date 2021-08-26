const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'test',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Testowa komenda",
        en: "Testing command",
    },
    category: 'test',

    permissions: [],
    allowedChannels: [],
    blockedChannels: [],
    allowedRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: true,
    async run(client, message, args) {

        const connection = joinVoiceChannel({
            channelId: '854756214713876530',
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        return message.channel.send('test');
    }
}