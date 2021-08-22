const { MessageEmbed } = require("discord.js");
const { translate } = require("../../utils/languages/languages");
const { palette } = require("../../utils/utils");
const { neededXp, getGuildProfile, getGlobalProfile } = require("../Profiles/profile");

async function addXpText(client, message) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    const guildConfig = client.guildConfigs.get(guildId);
    const multiplier = guildConfig.get('modules.xp.multiplier');
    const xpToAdd = Math.floor(Math.random() * (10 - 5) + 5);

    await addGuildXpText(client, guildId, message.channel.id, userId, xpToAdd, multiplier);
    await addGlobalXpText(client, userId, xpToAdd);
}

async function addGuildXpText(client, guildId, channelId, userId, xpToAdd, multiplier) {
    const guildProfile = await getGuildProfile(guildId, userId);
    const { level, xp } = guildProfile.statistics.text;
    const xpNeeded = neededXp(level);

    if(xp + (xpToAdd * multiplier) >= xpNeeded) return levelUp(client, guildProfile, channelId, xp, (xpToAdd * multiplier), xpNeeded);

    guildProfile.statistics.text.xp += xpToAdd * multiplier;
    guildProfile.statistics.text.totalXp += xpToAdd * multiplier;
    guildProfile.statistics.text.dailyXp += xpToAdd * multiplier;
    return guildProfile.save();
}

async function addGlobalXpText(client, userId, xpToAdd) {
    const globalProfile = await getGlobalProfile(userId);
    const { level, xp } = globalProfile.statistics.text;
    const xpNeeded = neededXp(level);

    if(xp + xpToAdd >= xpNeeded) return levelUp(client, globalProfile, null, xp, xpToAdd, xpNeeded, true);

    globalProfile.statistics.text.xp += xpToAdd;
    globalProfile.statistics.text.totalXp += xpToAdd;
    globalProfile.statistics.text.dailyXp += xpToAdd;
    return globalProfile.save();
}

async function levelUp(client, profile, channelId, xp, xpToAdd, xpNeeded, isGlobal) {
    const rest = (xp + xpToAdd) - xpNeeded;

    profile.statistics.text.level += 1;
    profile.statistics.text.xp = rest;
    profile.statistics.text.totalXp += xpToAdd;
    profile.statistics.text.dailyXp += xpToAdd;

    isGlobal && (profile.coins += profile.statistics.text.level * (10 + profile.statistics.text.level * 2))

    !isGlobal && sendLevelUpMessage(client, profile, channelId);

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