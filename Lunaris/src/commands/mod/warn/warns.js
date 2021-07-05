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
        en: "Displays warns list",
    },
    category: 'mod',
    syntax: {
        pl: 'warns [<@user> <page>]',
        en: 'warns [<@user> <page>]',
    },
    syntaxHelp: {
        pl: `Jeśli podany zostanie użytkownik, wyświelone zostaną ostrzeżenia tylko danego użytkownika`,
        en: `If you specify a user, only his warns will be displays`,
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
        // TODO: Rework this shitty code xD
        const guildConfig = client.guildConfigs.get(message.guild.id);
        const language = guildConfig.get('language');
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let page = args.find(a => a.startsWith('p:'));
        page = isNaN(page.slice(2)) ? 1 : Number(page.slice(2));

        let warns = await Warn.list(client, message.guild.id, member && member.id); // TODO: If member has no warns
        
        if(!member) {
            if(warns.error) {
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .setAuthor(translate(language, 'autoMod.warn.guildWarnList'), message.guild.iconURL())
                    .setDescription(warns.error)
                    .setTimestamp();

                checkEmbedLimits(client, embed, message.channel);

                return message.channel.send(embed);
            }

            warns = warns.map(v => {
                const {userID, warns} = v;

                return warns.map(v => {
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
                
            }).flat();
            //! Check if (fieldIndex % 3 === 0) blank; will looks better

            // console.log(warns);

            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setAuthor(translate(language, 'autoMod.warn.guildWarnList'), message.guild.iconURL())
                .addFields(warns)
                .setTimestamp();

            checkEmbedLimits(client, embed, message.channel, 9, page);

            return message.channel.send(embed);
        }

        if(warns.error) {
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setAuthor(translate(language, 'autoMod.warn.warnList', member.user.tag), message.guild.iconURL())
                .setDescription(warns.error)
                .setTimestamp();

            checkEmbedLimits(client, embed, message.channel, 9, page);

            return message.channel.send(embed);
        }

        warns = warns.map(v => {
            const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(v.date);
            const by = !isNaN(v.by) ? client.users.cache.get(v.by).tag : v.by;
            return {
                name: `Mod: ${by}`,
                value: `**${translate(language, 'general.reason')}**: ${v.reason}
                        **${translate(language, 'general.date')}**: ${date}` +
                        "\n**ID**: `" + v.id + "`",
                inline: true
            }
        });

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'autoMod.warn.warnList', member.user.tag), member.user.displayAvatarURL())
            .addFields(warns)
            .setTimestamp();

        checkEmbedLimits(client, embed, message.channel, 9, page);

        return message.channel.send(embed);
    }
}