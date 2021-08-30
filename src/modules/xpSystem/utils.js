const GuildMembers = require("../../database/schemas/GuildMembers");

async function resetDailyXp() {
    await GuildMembers.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
        'statistics.text.dailyXp': 0,
        'statistics.voice.dailyXp': 0,
    });
}

module.exports = { resetDailyXp };