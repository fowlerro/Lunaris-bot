const { MessageEmbed } = require("discord.js");
const { Mute } = require("../../../modules/autoMod/utils");
const { palette, checkEmbedLimits } = require("../../../utils/utils");
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
        const guildConfig = client.guildConfigs.get(message.guild.id);
        const language = guildConfig.get('language');
        let mutes = await Mute.list(client, message.guild.id);

        let page = args.find(a => a.startsWith('p:'))?.slice(2);
        page = isNaN(page) ? 1 : Number(page);

        if(!mutes.error) {
            mutes = mutes.map(v => {
                const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(v.muted.date);
                const by = !isNaN(v.muted.by) ? client.users.cache.get(v.muted.by).tag : v.muted.by;
                return {
                    name: `Nick: ${client.users.cache.get(v.userID).tag}`,
                    value: `**Mod**: ${by}
                            **${translate(language, 'general.reason')}**: ${v.muted.reason ? v.muted.reason : translate(language, 'general.none')}
                            **${translate(language, 'general.date')}**: ${date}`,
                    inline: true
                }
            });
            // ! Check if (fieldIndex % 3 === 0) blank; will looks better
        }


        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'autoMod.mute.muteList'), message.guild.iconURL())
            .setTimestamp();

        mutes.error ? embed.setDescription(mutes.error) : embed.addFields(mutes);

        checkEmbedLimits(client, embed, message.channel, 9, page);

        return message.channel.send(embed);
    }
}