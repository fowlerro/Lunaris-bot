const { MessageEmbed, Permissions, Formatters } = require("discord.js");
const Guilds = require("../../modules/Guilds");
const { translate } = require("../../utils/languages/languages");
const { getUserFromMention, palette } = require("../../utils/utils");

module.exports = {
    name: 'user',
    aliases: ['userinfo'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 1,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla informacje o użytkowniku",
        en: "Display info about a user",
    },
    syntax: {
        pl: 'user [<@user>]',
        en: 'user [<@user>]',
    },
    syntaxExample: 'user @Lunaris',

    permissions: new Permissions([
        Permissions.FLAGS.MANAGE_ROLES
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
            const user = args[0] ? await getUserFromMention(client, args[0]) : message.author;
            const { language } = await Guilds.config.get(client, message.guild.id);
            const member = await message.guild.members.fetch(user).catch(e => {});
            if(!member) return;

            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setTitle(translate(language, 'cmd.userInfo.title', member.user.tag))
                .setDescription(`ID: \`${member.id}\``)
                .addField(translate(language, 'cmd.userInfo.createdAt'), member.user.createdAt.toLocaleString(), true)
                .addField(translate(language, 'cmd.userInfo.joinedAt'), member.joinedAt.toLocaleString(), true)
                .addField(translate(language, 'cmd.userInfo.avatar'), Formatters.inlineCode(member.user.displayAvatarURL()))
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            if(this.autoRemove) return message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}