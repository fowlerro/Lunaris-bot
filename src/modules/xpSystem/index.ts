import { Message, VoiceState, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { GuildProfileModel } from "../../database/schemas/GuildProfile";
import { ProfileModel } from "../../database/schemas/Profile";
import { LevelConfigModel } from "../../database/schemas/LevelConfig";

import { handleTextXp } from "./text";
import { handleVoiceXp } from "./voice";

import { LevelConfig, LevelReward } from "types";

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

    async setLevelUpMessage(guildId: Snowflake, format?: string | null): Promise<LevelConfig | undefined> {
        const document = await LevelConfigModel.findOneAndUpdate({ guildId }, {
            levelUpMessage: {
                messageFormat: format
            }
        }, { upsert: true, new: true, runValidators: true }).catch(() => {})
        if(!document) return

        const newConfig = document.toObject()
        delete newConfig._id
        delete newConfig.__v

        await redis.levelConfigs.setEx(guildId, 60 * 5, JSON.stringify(newConfig))
        return newConfig
    }

    async addReward(guildId: Snowflake, reward: LevelReward, scope: 'text' | 'voice') {
        const config = await this.get(guildId)
        if(!config) return console.log('config')
        if(config.rewards[scope].length >= 20) return { error: 'rewardsLimit' }
        const document = await LevelConfigModel.findOneAndUpdate({ guildId }, {
            $push: { [`rewards.${scope}`]: reward }
        }, { upsert: true, new: true }).catch((e) => {console.log(e)})
        if(!document) return console.log('document')

        const newConfig = document.toObject()
        delete newConfig._id
        delete newConfig.__v

        await redis.levelConfigs.setEx(guildId, 60 * 5, JSON.stringify(newConfig))
        return newConfig
    }

    async handleTextXp(message: Message) {
        return handleTextXp(message)
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

export default new XpSystemModule()