const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const AutoMod = require("../../database/schemas/AutoMod");
const GuildConfig = require("../../database/schemas/GuildConfig");
const { localeList, translate } = require("../../utils/languages/languages");
const { setGuildConfig, setAutoModConfig } = require("../../utils/utils");

module.exports = {
    name: 'censor',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Zmiana języka bota",
        en: "Change bot language",
    },
    category: 'settings',

    permissions: [],
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

            const guildConfig = client.guildConfigs.get(message.guild.id);
            const language = guildConfig.get('language');

            let [state, ...words] = args;
            if(words.length) {
                words = words.join(" ");
                words = words.match(/[^\s"]+|"([^"]*)"/gi);
                words = words.map(word => word.replaceAll('"', ''));
            }
            if(state === 'add') {
                setAutoModConfig(client, message.guild.id, 'add', 'censor.words', words);
            } else if(state === 'remove') {
                setAutoModConfig(client, message.guild.id, 'remove', 'censor.words', words);
            } else if(state === 'list') {
                const results = client.autoModConfigs.get(message.guild.id);
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .setAuthor(translate(language, 'autoMod.censor.wordsListTitle'))
                    .setDescription(results.censor.words);

                message.channel.send(embed);
            }

        } catch(err) {
            console.log(err)
        }
    }
}