const { MessageEmbed } = require("discord.js");
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

    permissions: ['MANAGE_GUILD'],
    requiredChannels: [],
    blockedChannels: [],
    requiredRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: true,
    async run(client, message, args) {

        const guildID = message.guild.id;
        const channelID = message.channel.id;
        const messageID = args[0];
        let reactions = [];
        args.shift();
        args.forEach((element, index) => {
            let rs = element.split("|");
            reactions.push({reaction: rs[0], role: rs[1], mode: rs[2]});
        });

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