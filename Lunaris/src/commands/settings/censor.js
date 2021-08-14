const { MessageEmbed } = require("discord.js");
const { palette } = require("../../utils/utils");
const { translate } = require("../../utils/languages/languages");
const { setAutoModConfig } = require("../../utils/utils");

module.exports = {
    name: 'censor',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: false,
    status: true,

    description: {
        pl: "Umożliwia zarządzanie ustawieniami cenzury",
        en: "Allows to manage censor options",
    },
    category: 'settings',
    syntax: {
        pl: 'censor <add/remove/list> [<słowa>]',
        en: 'censor <add/remove/list> [<words>]',
    },
    syntaxHelp: {
        pl: `Słowa wprowadzane po spacji uznawane są za osobne wpisy
            Aby wprowadzić jeden wpis z kilkoma słowami należy napisać je w cudzysłowie`,
        en: `Separate words with space, if you need fraze, type it like that: "fraze"`,
    },
    syntaxExample: 'censor add fuck "fuck you"',

    permissions: [],
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
        const { language } = client.guildConfigs.get(message.guild.id);

        let [state, ...words] = args;
        if(words.length) {
            words = words.join(" ");
            words = words.match(/[^\s"]+|"([^"]*)"/gi);
            words = words.map(word => word.replace(/"/g, ''));
        }
        if(state === 'add') {
            return setAutoModConfig(client, message.guild.id, 'add', 'censor.words', words);
        }
        if(state === 'remove') {
            return setAutoModConfig(client, message.guild.id, 'remove', 'censor.words', words);
        }
        if(state === 'list') {
            let results = await client.autoModConfigs.get(message.guild.id);
            if(!results) results = setAutoModConfig(client, message.guild.id);

            let words = results.censor.words.length ? results.censor.words : translate(language, 'general.none');
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setAuthor(translate(language, 'autoMod.censor.wordsListTitle'))
                .setDescription(words);

            return message.channel.send({embeds: [embed]});
        }
    }
}