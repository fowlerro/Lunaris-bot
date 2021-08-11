const { MessageEmbed, Permissions } = require("discord.js");
const { palette } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
const { Warn } = require("../../../modules/autoMod/utils");

module.exports = {
    name: 'warn',
    aliases: ['w', 'ostrzez', 'ostrzezenie'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    cmdArgs: {list: 'warns'},
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Nakłada ostrzeżenie na użytkownika",
        en: "Warns user",
    },
    category: 'mod',
    syntax: {
        pl: 'warn <@user> [<powód>]',
        en: 'warn <@user> [<reason>]',
    },
    syntaxExample: 'warn @Lunaris toxic',

    permissions: new Permissions([
        Permissions.FLAGS.KICK_MEMBERS
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
    cooldownReminder: false,
    async run(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(user);
        if(!member) return;

        const { language } = client.guildConfigs.get(message.guild.id);
        let [user, ...reason] = args;
        reason = reason.join(" ");

        const result = await Warn.add(client, message.guild.id, member.id, reason, message.author.id);
        if(!result) return;

        const embed = new MessageEmbed()
            .setColor(palette.error)
            .setDescription(translate(language, 'autoMod.warn.addWarn', `<@${member.id}>`, `<@${message.author.id}>`, reason.length ? `| ${reason}` : ""));

        return message.channel.send({embeds: [embed]});
    }
}