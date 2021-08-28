const ms = require('ms');
const regex = /[0-9]+[d|h|m|s]/g
const { MessageEmbed, Permissions } = require("discord.js");
const { palette, getUserFromMention } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
const Guilds = require("../../../modules/Guilds");
const Mod = require('../../../modules/Mod');

module.exports = {
    name: 'ban',
    aliases: ['zbanuj', 'b'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    cmdArgs: {list: 'bans'},
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Banuje użytkownika",
        en: "Ban a user",
    },
    syntax: {
        pl: 'ban <@user> [<czas> <powód>]',
        en: 'ban <@user> [<time> <reason>]',
    },
    syntaxHelp: {
        pl: 'Format czasu: 1d 1h 1m 1s',
        en: 'Time format: 1d 1h 1m 1s',
    },
    syntaxExample: 'ban @Lunaris 12h 30m toxic',

    permissions: new Permissions([
        Permissions.FLAGS.BAN_MEMBERS
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
        const member = await getUserFromMention(client, args[0]);
        if(!member) return;

        const { language } = await Guilds.config.get(client, message.guild.id);

        let reason = '';
        let time = 0;

        for(let i = 1; i<args.length; i++) {
            if(args.length-1 < i) break;
            if(args[i].match(regex)) {
                for (const v of args[i].match(regex)) {
                    const t = v.split('')[v.split('').length-1];
                    // if(time[t]) continue;
                    time += ms(v)
                }
            } else {
                reason = args.slice(i, args.length).join(' ');
                break;
            }
        }

        const result = await Mod.ban.add(client, member.id, message.guild.id, message.author.id, reason, time);
        if(!result) return;
        const description = result.error === 'missingPermission' ? `${translate(language, 'permissions.missingPermission')}: ${result.perms}` : translate(language, 'autoMod.ban.add', `<@${member.id}>`, `<@${message.author.id}>`, reason.length ? `| ${reason}` : "")

        const embed = new MessageEmbed()
            .setColor(palette.error)
            .setDescription(description);

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
    }
}