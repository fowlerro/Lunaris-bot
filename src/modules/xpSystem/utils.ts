import { GuildMemberModel } from "../../database/schemas/GuildMembers";


export async function resetDailyXp() {
    await GuildMemberModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
        'statistics.text.dailyXp': 0,
        'statistics.voice.dailyXp': 0,
    });
}