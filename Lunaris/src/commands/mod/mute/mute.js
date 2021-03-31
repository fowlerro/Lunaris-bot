const { Mute } = require("../../../modules/autoMod/utils");
const regex = /[0-9]+[d|h|m|s]/g
const ms = require('ms');
const { MessageEmbed } = require("discord.js");
const {palette} = require('../../../bot');
const { translate } = require("../../../utils/languages/languages");

module.exports = {
    name: 'mute',
    aliases: ['mutuj', 'wycisz'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    cmdArgs: {list: 'mutes'},
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wycisza użytkownika",
        en: "Mutes user",
    },
    category: 'mod',
    syntax: {
        pl: 'mute <@user> [<czas> <powód>]',
        en: 'mute <@user> [<time> <reason>]',
    },
    syntaxHelp: {
        pl: 'Format czasu: 1d 1h 1m 1s',
        en: 'Time format: 1d 1h 1m 1s',
    },
    syntaxExample: 'mute @Lunaris 12h 30m toxic',

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

            let reason = '';
            let time = 0;

            for(let i = 1; i<5; i++) {
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

            const result = await Mute.add(client, message.guild.id, member.id, reason, message.author.id, time);
            if(!result) return;

            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(translate(language, 'autoMod.mute.addMute', `<@${member.id}>`, `<@${message.author.id}>`, reason.length ? `| ${reason}` : ""));

            return message.channel.send(embed);
        } catch(err) {
            console.log(err)
        }
    }
}