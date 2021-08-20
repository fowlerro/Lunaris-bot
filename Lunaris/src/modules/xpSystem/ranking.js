const GuildMembers = require("../../database/schemas/GuildMembers");

async function getTextRank(guildId, userId) {
    let collections = await GuildMembers.find({ guildId });
    collections = collections.sort((a, b) => b.statistics.text.totalXp - a.statistics.text.totalXp)

    return collections.findIndex(x => x.userId === userId) + 1;
}

async function getVoiceRank(guildId, userId) {
    let collections = await GuildMembers.find({ guildId });
    collections = collections.sort((a, b) => b.statistics.voice.totalXp - a.statistics.voice.totalXp)

    return collections.findIndex(x => x.userId === userId) + 1;
}

module.exports = { getTextRank, getVoiceRank }