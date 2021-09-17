const { MessageEmbed, Permissions } = require("discord.js");
const reactionRoles = require("../../modules/reactionRoles");

module.exports = {
    name: 'rr',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: true,
    globalStatus: true,
    status: true,

    description: {
        pl: "Komenda testowa",
        en: "Testing command",
    },
    category: 'settings',
    syntax: {
        pl: 'rr <message id> <emojiID|roleID|mode>',
        en: 'rr <message id> <emojiID|roleID|mode>',
    },

    permissions: new Permissions([
        Permissions.FLAGS.MANAGE_GUILD
    ]).toArray(),
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
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const messageId = args[0];
        if(!messageId) return;
        let reactions = [];
        args.shift();
        args.forEach((element, index) => {
            let rs = element.split("|");
            reactions.push({reaction: rs[0], role: rs[1], mode: rs[2]});
        });

        if(!reactions.length) return;

        reactionRoles.create(client, guildId, channelId, messageId, reactions);

        return message.channel.send("OK");
    }
}