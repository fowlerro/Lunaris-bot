const Profile = require("../../database/schemas/Profile");
const { neededXp } = require("../Profiles/profile");

async function addXpText(member) {
    const xpToAdd = Math.floor(Math.random() * (10 - 5) + 5);

    let profile = await Profile.findOne({ userId: member.id });
    if(!profile) {
        profile = await Profile.create({ userId: member.id });
    }
    const { level, xp } = profile.statistics.text;
    const xpNeeded = neededXp(level);
    if(xp + xpToAdd >= xpNeeded) {
        const rest = xpNeeded - (xp + xpToAdd);

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