import { Message, VoiceState, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import Profiles from "../Profiles";
import { handleVoiceXp } from "./voice";
import { GuildProfileDocument, GuildProfileModel } from "../../database/schemas/GuildProfile";
import { ProfileDocument, ProfileModel } from "../../database/schemas/Profile";
import { LevelConfig } from "types";
import { LevelConfigModel } from "../../database/schemas/LevelConfig";
import { levelUp } from "./levelUp";

const cooldowns = new Map<string, boolean>()

class XpSystemModule extends BaseModule {
    constructor() {
        super('XpSystem', true)
    }

    async run() {}

    async get(guildId: Snowflake): Promise<LevelConfig | undefined> {
        const json = await redis.levelConfigs.getEx(guildId, { EX: 60 * 5 })
        if(json) return JSON.parse(json) as LevelConfig

        const document = await LevelConfigModel.findOne({ guildId }, '-_id, -__v').catch(() => {})
        if(!document) return this.create(guildId)

        const config = document.toObject()
        await redis.levelConfigs.setEx(guildId, 60 * 5, JSON.stringify(config))
        return config
    }

    async create(guildId: Snowflake): Promise<LevelConfig | undefined> {
        const document = await LevelConfigModel.create({ guildId }).catch(() => {})
        if(!document) return
        const config = document.toObject()
        delete config._id
        delete config.__v
        await redis.levelConfigs.setEx(guildId, 60 * 5, JSON.stringify(config))
        return config
    }

    async addTextXp(message: Message) {
        const guildId = message.guild?.id;
        if(!guildId) return
        const channelId = message.channel.id
        const userId = message.author.id;

        const levelConfig = await this.get(guildId)
        if(!levelConfig) return
        const multiplier = levelConfig.multiplier || 1
        const xpToAdd = Math.floor(Math.random() * (35 - 20) + 20);

        await addGuildTextXp(guildId, channelId, userId, xpToAdd, multiplier);
        await addGlobalTextXp(userId, xpToAdd);
    }

    async handleVoiceXp(oldState: VoiceState, newState: VoiceState) {
        return handleVoiceXp(oldState, newState)
    }
    async resetDailyXp() {
        await GuildProfileModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
            'statistics.text.dailyXp': 0,
            'statistics.voice.dailyXp': 0,
        });
        await ProfileModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
            'statistics.text.dailyXp': 0,
            'statistics.voice.dailyXp': 0,
        });
        await redis.profiles.flushAll()
        await redis.guildProfiles.flushAll()
    }

}

async function addGuildTextXp(guildId: Snowflake, channelId: Snowflake, userId: Snowflake, xpToAdd: number, multiplier: number) {
    const guildProfile = await Profiles.get(userId, guildId) as GuildProfileDocument;
    const { level, xp } = guildProfile.statistics.text;
    if(cooldowns.get(`${guildId}-${userId}`)) return;
    cooldowns.set(`${guildId}-${userId}`, true)
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        cooldowns.set(`${guildId}-${userId}`, false)
    }, 60000);

    if(xp + (xpToAdd * multiplier) >= xpNeeded) return levelUp(guildProfile, channelId, xp, (xpToAdd * multiplier), xpNeeded);

    guildProfile.statistics.text.xp += xpToAdd * multiplier
    guildProfile.statistics.text.totalXp += xpToAdd * multiplier
    guildProfile.statistics.text.dailyXp += xpToAdd * multiplier

    await Profiles.set(guildProfile)

    return guildProfile
}

async function addGlobalTextXp(userId: Snowflake, xpToAdd: number) {
    const globalProfile = await Profiles.get(userId) as ProfileDocument;
    const { level, xp } = globalProfile.statistics.text;
    if(cooldowns.get(userId)) return;
    cooldowns.set(userId, true)
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        cooldowns.set(userId, false)
    }, 60000);

    if(xp + xpToAdd >= xpNeeded) return levelUp(globalProfile, null, xp, xpToAdd, xpNeeded, true);

    globalProfile.statistics.text.xp += xpToAdd
    globalProfile.statistics.text.totalXp += xpToAdd
    globalProfile.statistics.text.dailyXp += xpToAdd

    await Profiles.set(globalProfile)

    return globalProfile;
}



export default new XpSystemModule()