const { translate } = require("../../utils/languages/languages");

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 1,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Avatar",
        en: "Avatar",
    },
    category: 'misc',
    syntax: {
        pl: 'avatar <user>',
        en: 'avatar <user>',
    },
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
        // const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const member = !isNaN(args[0]) ? await message.guild.members.fetch(args[0]).catch(e => {}) : message.mentions.members.first() || (await message.guild.members.fetch(message.author.id));
        if(!member) return;

        const avatarURL = member.user.avatarURL();
        if(!avatarURL) return;

        return message.channel.send(avatarURL);
    }
}