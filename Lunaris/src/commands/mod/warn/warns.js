const { MessageEmbed } = require("discord.js");
const { palette } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
const { Warn } = require("../../../modules/autoMod/utils");
const { checkEmbedLimits } = require("../../../utils/utils");

module.exports = {
    name: 'warns',
    aliases: ['ostrzezenia', 'wlist'],
    ownerOnly: false,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla listę ostrzeżeń",
        en: "Displays warn list",
    },
    category: 'mod',
    syntax: {
        pl: 'warns [<@user> <page>]',
        en: 'warns [<@user> <page>]',
    },
    syntaxHelp: {
        pl: `Jeśli podany zostanie użytkownik, wyświelone zostaną tylko jego ostrzeżenia`,
        en: `If you specify a user, only his warns will be displayed`,
    },
    syntaxExample: 'warns @Lunaris',

    permissions: ['KICK_MEMBERS'],
    requiredChannels: [],
    blockedChannels: [],
    requiredRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: false,
    async run(client, message, args) {
        const guildConfig = client.guildConfigs.get(message.guild.id);
        const language = guildConfig.get('language');
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        let page = args.find(a => a.startsWith('p:'))?.slice(2);
        page = isNaN(page) ? 1 : Number(page);

        let warns = await Warn.list(client, message.guild.id, member && member.id);
        
        let embedAuthor = '';
        member ? embedAuthor = translate(language, 'autoMod.warn.warnList', member.user.tag) : embedAuthor = translate(language, 'autoMod.warn.guildWarnList');

        if(warns.warns) warns.warns = warns.warns.map(v => {
            const {userID, warns} = v;

            if(!member) return warns.map(v => {
                const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(v.date);
                const by = !isNaN(v.by) ? client.users.cache.get(v.by).tag : v.by;
                return {
                    name: `Nick: ${client.users.cache.get(userID).tag}`,
                    value: `**Mod**: ${by}
                            **${translate(language, 'general.reason')}**: ${v.reason}
                            **${translate(language, 'general.date')}**: ${date}` +
                            "\n**ID**: `" + v.id + "`",
                    inline: true
                }
            });
            const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(v.date);
            const by = !isNaN(v.by) ? client.users.cache.get(v.by).tag : v.by;

            return {
                name: `Mod: ${by}`,
                value: `**${translate(language, 'general.reason')}**: ${v.reason}
                        **${translate(language, 'general.date')}**: ${date}` +
                        "\n**ID**: `" + v.id + "`",
                inline: true
            }
        }).flat();

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(embedAuthor, message.guild.iconURL())
            .setTimestamp();
        warns.warns && embed.addFields(warns.warns);
        warns.error && embed.setDescription(warns.error);

        checkEmbedLimits(client, embed, message.channel, 9, page);

        return message.channel.send(embed);
    }
}