const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const { translate } = require("../../utils/languages/languages");
const { Warn } = require("../../utils/utils");

module.exports = {
    name: 'unwarn',
    aliases: ['uw'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Usuwa ostrzeżenie użytkownika",
        en: "Removes user warn",
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

            let result = await Warn.remove(message.guild.id, args[0]);
            if(!result) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'autoMod.warn.error'))

                return message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setColor(palette.success)
                    .setDescription(translate(language, 'autoMod.warn.removeWarn', `<@${message.author.id}>`, `<@${result.userID}>`, args[0] ? `| ${args[0]}` : ""))
    
                return message.channel.send(embed);
            }
        } catch(err) {
            console.log(err)
        }
    }
}