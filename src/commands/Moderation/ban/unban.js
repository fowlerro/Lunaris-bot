const { MessageEmbed, Permissions } = require("discord.js");
const { palette, getUserFromMention } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
const Guilds = require("../../../modules/Guilds");
const Mod = require("../../../modules/Mod");
module.exports = {
    name: 'unban',
    aliases: ['odbanuj', 'ub'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Zdejmuje bana użytkownika",
        en: "Unban a user",
    },
    syntax: {
        pl: 'unban <@user> [<powód>]',
        en: 'unban <@user> [<reason>]',
    },
    syntaxExample: 'unban @Lunaris',

    permissions: new Permissions([
        Permissions.FLAGS.BAN_MEMBERS
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
        const member = await getUserFromMention(client, args[0]);
        if(!member) return;
        
        const { language } = await Guilds.config.get(client, message.guild.id);
        const reason = args.slice(1, args.length).join(' ');

        const result = await Mod.ban.remove(client, member.id, message.guild.id, message.author.id, reason);
        if(!result) return;
        if(result.error === "notBanned") {
            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(translate(language, 'autoMod.ban.notBanned', `<@${member.id}>`));

            return message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
        }
        const description = result.error === 'missingPermission' ? `${translate(language, 'permissions.missingPermission')}: ${result.perms}` : translate(language, 'autoMod.ban.remove', `<@${member.id}>`, `<@${message.author.id}>`, reason.length ? `| ${reason}` : "")

        const embed = new MessageEmbed()
            .setColor(palette.error)
            .setDescription(description);

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
    }
}