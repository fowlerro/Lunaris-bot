const { MessageEmbed, Permissions } = require("discord.js");
const { palette } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
const { Warn } = require("../../../modules/autoMod/utils");
const { warnRemoveAllLog } = require("../../../modules/guildLogs");

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
    syntax: {
        pl: 'unwarn <id/all>',
        en: 'unwarn <id/all>',
    },
    syntaxHelp: {
        pl: `id: Identyfikator ostrzeżenia, które zostanie usunięte
            all: Wszystkie ostrzeżenia na serwerze zostaną usunięte`,
        en: `id: Warn's Id, which will be removed
            all: All warns on server will be removed`,
    },
    syntaxExample: 'unwarn _HG7UsitE',

    permissions: new Permissions([
        Permissions.FLAGS.KICK_MEMBERS
    ]).toArray(),
    allowedChannels: [],
    blockedChannels: [],
    allowedRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: false,
    async run(client, message, args) {
            const { language } = client.guildConfigs.get(message.guild.id);

            const result = await Warn.remove(client, message.guild.id, args[0], message.author.id);
            if(!result || result.error) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'autoMod.warn.error'))

                return message.channel.send({embeds: [embed]});
            }
            
            if(result.action === 'all') {
                const embed = new MessageEmbed()
                    .setColor(palette.success)
                    .setDescription(translate(language, 'autoMod.warn.removeAllWarns', `<@${message.author.id}>`))
    
                warnRemoveAllLog(client, message.guild.id, message.author.id);

                return message.channel.send({embeds: [embed]});
            }

            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(translate(language, 'autoMod.warn.removeWarn', `<@${message.author.id}>`, `<@${result.userID}>`, args[0] ? `| ${args[0]}` : ""))

            return message.channel.send({embeds: [embed]});
    }
}