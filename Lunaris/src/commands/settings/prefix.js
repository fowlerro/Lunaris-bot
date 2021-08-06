const { MessageEmbed, Permissions } = require("discord.js");
const { palette } = require("../../utils/utils");
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

    permissions: new Permissions([
        Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_CHANNELS
    ]).toArray(),
    allowedChannels: [],
    blockedChannels: [],
    allowedRoles: [],
    blockedRoles: ['861596116821737532', '821483520290979901'],

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
    
            return message.channel.send({ embeds: [embed]});
        } catch(err) {
            console.log(err);
        }
    }
}