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
    maxArgs: 1,
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
        pl: 'ranking',
        en: 'ranking',
    },
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
        const { language } = await Guilds.config.get(client, message.guild.id);
        const authorProfile = await Profiles.get(client, message.author.id, message.guild.id);

        
        if(['gold', 'coin', 'coins', 'money'].includes(args[0])) {
            
            const result = await GuildMembers.aggregate([
                { $match: { guildId: message.guild.id } },
                { $lookup: { from: "profiles", localField: "userId", foreignField: "userId", as: "id"  } },
                { $unwind: "$id" },
                { $replaceRoot: { newRoot: "$id" } }
            ]);

            const sorted = result.sort((a, b) => b.coins - a.coins);
            const rank = [];
            let myRank = false;

            sorted.every((profile, index) => {
                if(index === 10) return false;
                if(authorProfile.userId === profile.userId) myRank = true;
                rank.push(authorProfile.userId === profile.userId ? `**#${index+1}. <@${profile.userId}> | ${profile.coins} coins**`
                    : `#${index+1}. <@${profile.userId}> | ${profile.coins} coins`);
                return true;
            });
    
            if(!myRank) {
                const index = sorted.findIndex(profile => profile.userId === authorProfile.userId);
                const myProfile = sorted[index];
                rank[9] = `**#${index+1}. <@${myProfile.userId}> | ${myProfile.coins} coins**`
            }

            const embed = new MessageEmbed()
                .setColor(palette.primary)
                .addField(translate(language, 'cmd.ranking.coins'), rank.join('\n'), true)
                .setFooter(translate(language, 'cmd.ranking.lastUpdate'))
                .setTimestamp(Profiles.lastSave);

            return message.channel.send({ embeds: [embed] })
        }

        const collection = await GuildMembers.find({ guildId: message.guild.id })
        
        const sortedText = collection.sort((a, b) => b.statistics.text.totalXp - a.statistics.text.totalXp)

        const textRank = [];
        let myTextRank = false;
        const voiceRank = [];
        let myVoiceRank = false;

        sortedText.every((profile, index) => {
            if(index === 10) return false;
            if(authorProfile.userId === profile.userId) myTextRank = true;
            textRank.push(authorProfile.userId === profile.userId ? `**#${index+1}. <@${profile.userId}> | ${profile.statistics.text.level} level, \`${profile.statistics.text.totalXp}\` xp**`
                : `#${index+1}. <@${profile.userId}> | ${profile.statistics.text.level} level, \`${profile.statistics.text.totalXp}\` xp`);
            return true;
        });

        if(!myTextRank) {
            const index = sortedText.findIndex(profile => profile.userId === authorProfile.userId);
            const myProfile = sortedText[index];
            textRank[9] = `**#${index+1}. <@${myProfile.userId}> | ${myProfile.statistics.text.level} level, \`${myProfile.statistics.text.totalXp}\` xp**`
        }

        const sortedVoice = collection.sort((a, b) => b.statistics.voice.totalXp - a.statistics.voice.totalXp)

        sortedVoice.every((profile, index) => {
            if(index === 10) return false;
            if(authorProfile.userId === profile.userId) myVoiceRank = true;
            voiceRank.push(authorProfile.userId === profile.userId ? `**#${index+1}. <@${profile.userId}> | ${profile.statistics.voice.level} level, \`${profile.statistics.voice.totalXp}\` xp**`
                : `#${index+1}. <@${profile.userId}> | ${profile.statistics.voice.level} level, \`${profile.statistics.voice.totalXp}\` xp`);
            return true;
        });

        if(!myVoiceRank) {
            const index = sortedVoice.findIndex(profile => profile.userId === authorProfile.userId);
            const myProfile = sortedVoice[index];
            voiceRank[9] = `**#${index+1}. <@${myProfile.userId}> | ${myProfile.statistics.voice.level} level, \`${myProfile.statistics.voice.totalXp}\` xp**`
        }

        const embed = new MessageEmbed()
            .setColor(palette.primary)
            .addField(translate(language, 'cmd.ranking.text'), textRank.join('\n'), true)
            .addField(translate(language, 'cmd.ranking.voice'), voiceRank.join('\n'), true)
            .setFooter(translate(language, 'cmd.ranking.lastUpdate'))
            .setTimestamp(Profiles.lastSave);

        return message.channel.send({ embeds: [embed] });
    }
}