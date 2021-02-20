const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const { translate } = require("../../utils/languages/languages");
const { Warn } = require("../../utils/utils");

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
        pl: "Nakłada ostrzeżenie na użytkownika",
        en: "Warns user",
    },
    category: 'mod',

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
        try {
            const guildConfig = client.guildConfigs.get(message.guild.id);
            const language = guildConfig.get('language');
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            const warns = await Warn.list(client, message.guild.id, member && member.id);
            
            if(!member) {
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .setAuthor(translate(language, 'autoMod.warn.guildWarnList'), message.guild.iconURL())
                    .setDescription(warns)
                    .setTimestamp();

                return message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .setAuthor(translate(language, 'autoMod.warn.warnList', member.user.tag), member.user.displayAvatarURL())
                    .setDescription(warns)
                    .setTimestamp();
    
                return message.channel.send(embed);
            }
        } catch(err) {
            console.log(err)
        }
    }
}