const { MessageEmbed } = require("discord.js");
const GuildMembers = require("../../database/schemas/GuildMembers");
const Profile = require("../../database/schemas/Profile");
const { translate } = require("../../utils/languages/languages");
const { palette } = require("../../utils/utils");
const { neededXp } = require("../Profiles/profile");

async function addXpText(client, message) {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const xpToAdd = Math.floor(Math.random() * (10 - 5) + 5);

    let profile = await GuildMembers.findOne({ guildId, userId });
    if(!profile) {
        profile = await GuildMembers.create({ guildId, userId });
    }
    const { level, xp } = profile.statistics.text;
    const xpNeeded = neededXp(level);
    if(xp + xpToAdd >= xpNeeded) return levelUp(client, profile, message.channel.id, xp, xpToAdd, xpNeeded);

    profile.statistics.text.xp += xpToAdd;
    profile.statistics.text.totalXp += xpToAdd;
    profile.statistics.text.dailyXp += xpToAdd;

    return profile.save();
}

async function levelUp(client, profile, channelId, xp, xpToAdd, xpNeeded) {
    const rest = (xp + xpToAdd) - xpNeeded;

    profile.statistics.text.level += 1;
    profile.statistics.text.xp = rest;
    profile.statistics.text.totalXp += xpToAdd;
    profile.statistics.text.dailyXp += xpToAdd;

    sendLevelUpMessage(client, profile, channelId);

    return profile.save();
}

async function sendLevelUpMessage(client, profile, channelId) {
    const guildConfig = client.guildConfigs.get(profile.guildId);
    const messageMode = guildConfig.get('modules.xp.levelUpMessage.mode');
    if(messageMode === 'off') return;
    const language = guildConfig.get('language');
    const guild = await client.guilds.fetch(profile.guildId);
    let channel;
    channel = messageMode === 'currentChannel' ? await guild.channels.fetch(channelId) : await guild.channels.fetch(guildConfig.get('modules.xp.levelUpMessage.channelId'));


    const embed = new MessageEmbed()
        .setColor(palette.primary)
        .setDescription(translate(language, 'xp.levelUpMessage', profile.statistics.text.level, `<@${profile.userId}>`));

    channel.send({ embeds: [embed] });
}

module.exports = { addXpText };