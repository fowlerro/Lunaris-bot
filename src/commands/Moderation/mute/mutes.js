const { MessageEmbed, Permissions } = require("discord.js");
const { Mute } = require("../../../modules/Mod/utils");
const { palette } = require("../../../utils/utils");
const { translate } = require("../../../utils/languages/languages");
const Guilds = require("../../../modules/Guilds");
const Embeds = require("../../../modules/Embeds");

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
        const { language } = await Guilds.config.get(client, message.guild.id);
        let mutes = await Mute.list(client, message.guild.id);

        let page = args.find(a => a.startsWith('p:'))?.slice(2);
        page = isNaN(page) ? 1 : Number(page);

        if(!mutes.error) {
            mutesPromises = await mutes.map(async v => {
                const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(v.muted.date);
                // const by = !isNaN(v.muted.by) ? client.users.cache.get(v.muted.by).tag : v.muted.by;
                let by;
                if(isNaN(v.muted.by)) by = v.muted.by;
                if(!isNaN(v.muted.by) && client.users.cache.get(v.muted.by)) by = client.users.cache.get(v.muted.by).tag;
                if(!isNaN(v.muted.by) && !client.users.cache.get(v.muted.by)) by = await client.users.fetch(v.muted.by);

                let userNick = client.users.cache.get(v.userId);
                if(!userNick) userNick = await client.users.fetch(v.userId);
                userNick = userNick.tag;

                return {
                    name: `Nick: ${userNick}`,
                    value: `**Mod**: ${by}
                            **${translate(language, 'general.reason')}**: ${v.muted.reason ? v.muted.reason : translate(language, 'general.none')}
                            **${translate(language, 'general.date')}**: ${date}`,
                    inline: true
                }
            });

            mutes = await Promise.all(mutesPromises);
            // ! Check if (fieldIndex % 3 === 0) blank; will looks better
        }


        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'autoMod.mute.muteList'), message.guild.iconURL())
            .setTimestamp();

        mutes.error ? embed.setDescription(mutes.error) : embed.addFields(mutes);

        const embeds = Embeds.checkLimits(embed, true, 9)
		if(embeds?.error)
			return message.channel.send({ content: 'Error' })

		return Embeds.pageEmbeds(client, embeds, message.guild.id, message.channel.id, page, true)
    }
}