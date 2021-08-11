const { Mute } = require("../../../modules/autoMod/utils");
const regex = /[0-9]+[d|h|m|s]/g
const ms = require('ms');
const { MessageEmbed, Permissions } = require("discord.js");
const { palette } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
module.exports = {
    name: 'unmute',
    aliases: ['odmutuj', 'odcisz', 'um'],
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
    syntax: {
        pl: 'unmute <@user> [<powód>]',
        en: 'unmute <@user> [<reason>]',
    },
    syntaxExample: 'unmute @Lunaris',

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
        // TODO: Add parameter 'all' to unmute command
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member && args[0] !== 'all') return;
        
        const { language } = client.guildConfigs.get(message.guild.id);
        const reason = args.slice(1, args.length).join(' ');

        if(args[0] === 'all') {
            const result = await Mute.removeAll(client, message.guild.id, reason);

            const description = result.error === 'missingPermission' ? `${translate(language, 'permissions.missingPermission')}: ${result.perms}` : translate(language, 'autoMod.mute.removeMuteAll')

            const embed = new MessageEmbed()
                .setColor(result.error ? palette.error : palette.success)
                .setDescription(description);

            return message.channel.send({embeds: [embed]});
        }

        const result = await Mute.remove(client, message.guild.id, message.author.id, member.id, reason);
        if(!result) return;
        if(result === "notMuted") {
            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(translate(language, 'autoMod.mute.notMuted', `<@${member.id}>`));

            return message.channel.send({embeds: [embed]});
        }
        
        const embed = new MessageEmbed()
            .setColor(palette.success)
            .setDescription(translate(language, 'autoMod.mute.removeMute', `<@${member.id}>`, `<@${message.author.id}>`));

        return message.channel.send({embeds: [embed]});
    }
}