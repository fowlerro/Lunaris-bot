const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const { translate } = require("../../utils/languages/languages");
const { setGuildConfig } = require("../../utils/utils");

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
    syntax: {
        pl: 'prefix <prefix>',
        en: 'prefix <prefix>',
    },
    syntaxExample: 'prefix &',

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
            let guildConfig = await setGuildConfig(client, message.guild.id, 'prefix', args[0]);
            const language = guildConfig.get('language');
            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(translate(language, "cmd.prefixChange", "`" + guildConfig.get('prefix') + "`"));
    
            return message.channel.send(embed);
        } catch(err) {
            console.log(err);
        }
    }
}