const { MessageEmbed } = require("discord.js");
const { palette } = require("../../utils/utils");
const { localeList, translate } = require("../../utils/languages/languages");
const Guilds = require("../../modules/Guilds");

module.exports = {
    name: 'language',
    aliases: ['lang'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 1,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Zmiana języka bota",
        en: "Change bot language",
    },
    category: 'settings',
    syntax: {
        pl: 'language [<język>]',
        en: 'language [<language>]',
    },
    syntaxHelp: {
        pl: `Bez uwzględnienia języka, zostanie wyświetlona lista wspieranych języków`,
        en: `If not provide language, command will displays list of supported languages`,
    },
    syntaxExample: 'language en',

    permissions: ['MANAGE_GUILD'],
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
        let guildConfig = await Guilds.config.get(client, message.guild.id);
        let language = guildConfig.get('language');
        if(!args[0]) {
            let langs = "";
            langs = localeList().map(lang => langs + "`" + lang + "` " + translate(lang, 'name'));
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .addField(translate(language, 'cmd.languageListMessage'), langs.join('\n'))
                .setFooter(translate(language, "cmd.languageListFooter", guildConfig.get('prefix')));

            return message.channel.send({embeds: [embed]});
        };
        if(!localeList().includes(args[0]) && !localeList().some(lang => translate(lang, 'name').toLowerCase() == args[0].toLowerCase())) {
            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(translate(language, "cmd.wrongLanguage", guildConfig.get('prefix')));
    
            return message.channel.send({embeds: [embed]});
        }
        if(localeList().some(lang => translate(lang, 'name').toLowerCase() == args[0].toLowerCase())) {
            localeList().forEach(lang => {
                if(translate(lang, 'name').toLowerCase() == args[0].toLowerCase()) args[0] = lang;
            })
        }


        guildConfig = await Guilds.config.set(client, message.guild.id, 'language', args[0]);
        language = guildConfig.get('language');
        const embed = new MessageEmbed()
            .setColor(palette.success)
            .setDescription(translate(language, "cmd.languageChange", "`" + language + "`"));

        return message.channel.send({embeds: [embed]});
    }
}