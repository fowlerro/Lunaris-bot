const { Mute } = require("../../../modules/autoMod/utils");
const regex = /[0-9]+[d|h|m|s]/g
const ms = require('ms');
const { MessageEmbed } = require("discord.js");
const {palette} = require('../../../bot');
const { translate } = require("../../../utils/languages/languages");

module.exports = {
    name: 'unmute',
    aliases: ['odmutuj', 'odcisz'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Odcisza użytkownika",
        en: "Unmutes user",
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
            if(!member) return;

            const result = await Mute.remove(client, message.guild.id, member.id);
            if(!result) return;
            if(result === "notMuted") {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'autoMod.mute.notMuted', `<@${member.id}>`));
    
                return message.channel.send(embed);
            }
            
            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(translate(language, 'autoMod.mute.removeMute', `<@${member.id}>`, `<@${message.author.id}>`));

            return message.channel.send(embed);
        } catch(err) {
            console.log(err)
        }
    }
}