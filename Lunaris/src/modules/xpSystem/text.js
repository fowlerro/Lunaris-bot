const GuildMembers = require("../../database/schemas/GuildMembers");
const Profile = require("../../database/schemas/Profile");
const { neededXp } = require("../Profiles/profile");

async function addXpText(guildId, userId) {
    const xpToAdd = Math.floor(Math.random() * (10 - 5) + 5);

    let profile = await GuildMembers.findOne({ guildId, userId });
    if(!profile) {
        profile = await GuildMembers.create({ guildId, userId });
    }
    const { level, xp } = profile.statistics.text;
    const xpNeeded = neededXp(level);
    if(xp + xpToAdd >= xpNeeded) {
        const rest = (xp + xpToAdd) - xpNeeded;

        profile.statistics.text.level += 1;
        profile.statistics.text.xp = rest;
        profile.statistics.text.totalXp += xpToAdd;
        profile.statistics.text.todayXp += xpToAdd;

        return profile.save();
    }

    profile.statistics.text.xp += xpToAdd;
    profile.statistics.text.totalXp += xpToAdd;
    profile.statistics.text.todayXp += xpToAdd;

    return profile.save();
}

module.exports = {addXpText};