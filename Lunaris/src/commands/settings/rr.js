const { MessageEmbed, Permissions } = require("discord.js");
const GuildConfig = require("../../database/schemas/GuildConfig");
const ReactionRoles = require("../../database/schemas/ReactionRoles");
const { createReactionMessage } = require("../../modules/reactionRoles");

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
    async run(client, message, args) { //TODO: Fix whole reaction role system
        const guildID = message.guild.id;
        const channelID = message.channel.id;
        const messageID = args[0];
        if(!messageID) return;
        let reactions = [];
        args.shift();
        args.forEach((element, index) => {
            let rs = element.split("|");
            reactions.push({reaction: rs[0], role: rs[1], mode: rs[2]});
        });

        if(!reactions.length) return;

        createReactionMessage(guildID, channelID, messageID, reactions, client);

        return message.channel.send("OK");

        // try {
        //     await ReactionRoles.create({
        //         guildID: message.guild.id,
        //         channelID: message.channel.id,
        //         messageID: args[0]
        //     });

        //     return message.channel.send("OK");
        // } catch(err) {
        //     console.log(err);
        // }
    }
}