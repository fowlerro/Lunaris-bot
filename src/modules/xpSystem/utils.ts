import { GuildProfileModel } from "../../database/schemas/GuildProfile";


export async function resetDailyXp() {
    await GuildProfileModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
        'statistics.text.dailyXp': 0,
        'statistics.voice.dailyXp': 0,
    });
}