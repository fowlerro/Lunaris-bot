const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const GuildConfig = require("../../database/schemas/GuildConfig");
const { getLocale } = require("../../utils/languages/languages");

module.exports = {
    name: 'prefix',
    aliases: ['p'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: 1,
    autoRemove: true,
    autoRemoveResponse: true,
    globalStatus: true,
    status: true,

    description: {
        pl: "Zmiana prefixu bota",
        en: "Change bot prefix",
    },
    category: 'settings',

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
        try {
            let guildConfig = await GuildConfig.findOneAndUpdate({guildID: message.guild.id}, {
                prefix: args[0]
            }, {new: true});
            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(getLocale(guildConfig.get('language'), "prefixChange", "`" + guildConfig.get('prefix') + "`"));
    
            return message.channel.send(embed);
        } catch(err) {
            console.log(err);
        }
    }
}