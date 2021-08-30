const { MessageEmbed, Permissions } = require("discord.js");
const Guilds = require("../../modules/Guilds");
const { getChannelFromMention, getUserFromMention } = require("../../utils/utils");

module.exports = {
    name: 'purge',
    aliases: [],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Usuwa wiele wiadomości na raz",
        en: "Remove multiple messages at once",
    },
    category: 'mod',
    syntax: {
        pl: 'purge <ilość> [<user> <kanał>]',
        en: 'purge <count> [<user> <channel>]',
    },
    syntaxExample: 'purge 10',

    permissions: new Permissions([
        Permissions.FLAGS.MANAGE_MESSAGES
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
            const { language } = await Guilds.config.get(client, message.guild.id);

            let count = parseInt(args[0]) || 0;
            if(!count) return message.reply({ content: 'Please, provide a number of messages to purge!' });
            if(count > 100) count = 100;
            args.shift();

            let channel = await getChannelFromMention(message.guild, args[0]);
            if(channel) args.shift();
            const member = args[0] && await getUserFromMention(client, args[0]);
            if(member) args.shift();

            if(!channel && args.length) channel = await getChannelFromMention(message.guild, args[0]);
            if(!channel) channel = message.channel

            let fetched = await channel.messages.fetch({ limit: member ? 100 : count });
            if(member) {
                let filterCount = 0;
                fetched = fetched.filter(message => message.author.id === member.id).filter(() => {
                    filterCount ++;
                    return filterCount <= count;
                })
            }
            await channel.bulkDelete(fetched, true);
    }
}