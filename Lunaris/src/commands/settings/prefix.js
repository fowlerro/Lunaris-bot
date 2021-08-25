const { MessageEmbed, Permissions } = require("discord.js");
const { palette } = require("../../utils/utils");
const { translate } = require("../../utils/languages/languages");
const Guilds = require("../../modules/Guilds");

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
        const { prefix, language } = await Guilds.config.set(client, message.guild.id, 'prefix', args[0]);
        const embed = new MessageEmbed()
            .setColor(palette.success)
            .setDescription(translate(language, "cmd.prefixChange", "`" + prefix + "`"));

        return message.channel.send({embeds: [embed]});
    }
}