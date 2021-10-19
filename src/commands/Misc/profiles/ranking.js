const { MessageEmbed } = require("discord.js");
const GuildMembers = require("../../../database/schemas/GuildMembers");
const Profile = require("../../../database/schemas/Profile");
const Guilds = require("../../../modules/Guilds");
const Profiles = require("../../../modules/Profiles");
const { translate } = require("../../../utils/languages/languages");
const { palette } = require("../../../utils/utils");

module.exports = {
    name: 'ranking',
    aliases: ['rank'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 2,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla ranking",
        en: "Displays ranking",
    },
    category: 'profiles',
    syntax: {
        pl: 'ranking [global/coin]',
        en: 'ranking [global/coin]',
    },
    syntaxExample: 'ranking global coin',
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
        message.channel.sendTyping()
        const { language } = await Guilds.config.get(client, message.guild.id);
        const authorProfile = await Profiles.get(client, message.author.id, message.guild.id);

        const goldMode = ['gold', 'coin', 'coins', 'money'].some(arg => args.includes(arg))
        const globalMode =  ['global', 'g'].some(arg => args.includes(arg))
        const mode = goldMode && globalMode ? 'globalGold' : goldMode ? 'gold' : globalMode ? 'global' : 'normal'

        const result = await fetchData(mode, message.guild.id)

        const rank = { text: [], voice: [], gold: [] };
        const myRank = { text: false, voice: false, gold: false };

        for await (const [key, value] of Object.entries(result)) {
            await formatList(key, mode, rank, myRank, authorProfile, value)
        }

        return send(message, language, mode, rank)
    }
}

async function fetchData(mode, guildId) {
    if(mode === 'globalGold') {
        const results = await Profile.find()
        return { gold: results.sort((a, b) => b.coins - a.coins) }
    }

    if(mode === 'gold') {
        const results = await GuildMembers.aggregate([
            { $match: { guildId } },
            { $lookup: { from: "profiles", localField: "userId", foreignField: "userId", as: "id"  } },
            { $unwind: "$id" },
            { $replaceRoot: { newRoot: "$id" } }
        ])
        return { gold: results.sort((a, b) => b.coins - a.coins) }
    }

    const results = mode === 'global' ? await Profile.find() : await GuildMembers.find({ guildId })
    return {
        text: Array.from(results).sort((a, b) => b.statistics.text.totalXp - a.statistics.text.totalXp),
        voice: Array.from(results).sort((a, b) => b.statistics.voice.totalXp - a.statistics.voice.totalXp)
    }
}

async function formatList(key, mode, rank, authorRank, authorProfile, profiles) {
    for await (const [index, profile] of profiles.entries()) {
        if(index >= 10) break;

        const isAuthor = authorProfile.userId === profile.userId
        if(isAuthor) authorRank[key] = true
        

        if(mode === 'gold') rank[key].push(isAuthor ? `**${formatDisplayText(mode, { index, userId: profile.userId, coins: profile.coins })}**`
            : formatDisplayText(mode, { index, userId: profile.userId, coins: profile.coins }))

        if(mode === 'globalGold') {
            const user = await global.client.users.fetch(profile.userId).catch((err) => console.log(err))
            const tag = `${user.username}#${user.discriminator}`
            rank[key].push(isAuthor ? `**${formatDisplayText(mode, { index, tag, coins: profile.coins })}**`
                : formatDisplayText(mode, { index, tag, coins: profile.coins }))
        }

        if(mode === 'global') {
            const user = await global.client.users.fetch(profile.userId).catch((err) => console.log(err))
            const tag = `${user.username}#${user.discriminator}`
            rank[key].push(isAuthor ? `**${formatDisplayText(mode, { index, tag, level: profile.statistics[key].level, totalXp: profile.statistics[key].totalXp })}**`
                : formatDisplayText(mode, { index, tag, level: profile.statistics[key].level, totalXp: profile.statistics[key].totalXp }))
        }

        if(mode === 'normal') rank[key].push(isAuthor ? `**${formatDisplayText(mode, { index, userId: profile.userId, level: profile.statistics[key].level, totalXp: profile.statistics[key].totalXp })}**`
            : formatDisplayText(mode, { index, userId: profile.userId, level: profile.statistics[key].level, totalXp: profile.statistics[key].totalXp }))
    }

    if(!authorRank[key]) {
        const index = profiles.findIndex(profile => profile.userId === authorProfile.userId);
        const myProfile = profiles[index];
        if(mode === 'gold') {
            rank[key][9] = `**${formatDisplayText(mode, { index, userId: myProfile.userId, coins: myProfile.coins })}**`
        }
        
        if(mode === 'globalGold') {
            const user = await global.client.users.fetch(myProfile.userId).catch(() => {})
            const tag = `${user.username}#${user.discriminator}`
            rank[key][9] = `**${formatDisplayText(mode, { index, tag, coins: myProfile.coins })}**`
        }
        if(key !== 'gold' && mode === 'normal') rank[key][9] = `**${formatDisplayText(mode, { index, userId: myProfile.userId, level: myProfile.statistics[key].level, totalXp: myProfile.statistics[key].totalXp })}**`

        if(key !== 'gold' && mode === 'global') {
            const user = await global.client.users.fetch(myProfile.userId).catch(() => {})
            const tag = `${user.username}#${user.discriminator}`
            rank[key][9] = `**${formatDisplayText(mode, { index, tag, level: myProfile.statistics[key].level, totalXp: myProfile.statistics[key].totalXp })}**`
        }
    }
}

function formatDisplayText(mode, variables) {
    if(mode === 'gold') return `#${variables.index+1}. <@${variables.userId}> | ${variables.coins} coins`
    if(mode === 'globalGold') return `#${variables.index+1}. ${variables.tag} | ${variables.coins} coins`
    if(mode === 'global') return `#${variables.index+1}. ${variables.tag} | ${variables.level} level, \`${variables.totalXp}\` xp`
    return `#${variables.index+1}. <@${variables.userId}> | ${variables.level} level, \`${variables.totalXp}\` xp`
}

function send(message, language, mode, rank) {
    const embed = new MessageEmbed()
        .setColor(palette.primary)
        .setFooter(translate(language, 'cmd.ranking.lastUpdate'))
        .setTimestamp(Profiles.lastSave);

    mode === 'gold' || mode === 'globalGold' ? embed.addField(translate(language, 'cmd.ranking.coins'), rank.gold.join('\n'), true) :
        embed.addField(translate(language, 'cmd.ranking.text'), rank.text.join('\n'), true)
            .addField(translate(language, 'cmd.ranking.voice'), rank.voice.join('\n'), true)

    return message.channel.send({ embeds: [embed] });
}