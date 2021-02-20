const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const { translate } = require("../../utils/languages/languages");
const { Warn } = require("../../utils/utils");

module.exports = {
    name: 'warn',
    aliases: ['w', 'ostrzez', 'ostrzezenie'],
    ownerOnly: false,
    minArgs: 1,
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
            let [user, ...reason] = args;
            reason = reason.join(" ");
            
            const member = message.mentions.members.first() || message.guild.members.cache.get(user);
            if(!member) return;

            const result = await Warn.add(message.guild.id, member.id, reason, message.author.id);
            if(!result) return;

            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(translate(language, 'autoMod.warn.addWarn', `<@${member.id}>`, `<@${message.author.id}>`, reason.length ? `| ${reason}` : ""));

            return message.channel.send(embed);
        } catch(err) {
            console.log(err)
        }
    }
}