const { MessageEmbed } = require("discord.js");
const { Mute } = require("../../../modules/autoMod/utils");
const { palette } = require("../../../bot");
const { translate } = require("../../../utils/languages/languages");

module.exports = {
    name: 'mutes',
    aliases: ['mutelist', 'mlist', 'muty', 'mute list'],
    ownerOnly: false,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla listę mute'ów",
        en: "Display mute list",
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
            const mutes = await Mute.list(client, message.guild.id);
            
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setAuthor(translate(language, 'autoMod.mute.muteList'), message.guild.iconURL())
                .setDescription(mutes)
                .setTimestamp();

            return message.channel.send(embed);
        } catch(err) {
            console.log(err)
        }
    }
}