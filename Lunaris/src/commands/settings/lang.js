const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const GuildConfig = require("../../database/schemas/GuildConfig");
const { getLocale, localeList } = require("../../utils/languages/languages");

module.exports = {
    name: 'language',
    aliases: ['lang'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 1,
    autoRemove: true,
    autoRemoveResponse: true,
    globalStatus: true,
    status: true,

    description: {
        pl: "Zmiana języka bota",
        en: "Change bot language",
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
            let guildConfig = await GuildConfig.findOne({guildID: message.guild.id});
            if(!args[0]) {
                let langs = "";
                langs = localeList().map(lang => langs + "`" + lang + "`");
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .addField(getLocale(guildConfig.get('language'), 'languageListMessage'), langs)
                    .setFooter(getLocale(guildConfig.get('language'), "languageListFooter", guildConfig.get('prefix')));

                return message.channel.send(embed);
            };
            if(!localeList().includes(args[0])) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(getLocale(guildConfig.get('language'), "wrongLanguage", guildConfig.get('prefix')));
        
                return message.channel.send(embed);
            }
            guildConfig = await GuildConfig.findOneAndUpdate({guildID: message.guild.id}, {
                language: args[0]
            }, {new: true});
            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(getLocale(guildConfig.get('language'), "languageChange", "`" + guildConfig.get('language') + "`"));
    
            return message.channel.send(embed);
        } catch(err) {
            console.log(err);
        }
    }
}