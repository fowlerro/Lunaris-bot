import { Snowflake } from "discord.js";
import BaseModule from "../../utils/structures/BaseModule";
import { WelcomeMessageModel } from "../../database/schemas/WelcomeMessage";

class WelcomeMessageModule extends BaseModule {
    constructor() {
       super('Welcome Message', true)
    } 

    async run() {
            
    }

    async message() {
        
    }

    async add(guildId: Snowflake, format: string) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            $push: { format }
        }, { upsert: true, new: true }).catch(() => {})

        return config
    }

    async delete(guildId: Snowflake, formatIndex: number) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOne({ guildId }).catch(() => {})
        if(!config) return
        config.format.splice(formatIndex, 1)
        const result = await config.save().catch(() => {})
        return result
    }

    async set(guildId: Snowflake, textChannelId: Snowflake) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            channelId: textChannelId
        }, { upsert: true, new: true }).catch(() => {})

        return config
    }

    async list(guildId: Snowflake) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOne({ guildId }).catch(() => {})
        if(!config) return []

        return config.format
    }
}

export default new WelcomeMessageModule()