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

    async get(guildId: Snowflake) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOne({ guildId }, {}, { upsert: true }).catch(e => { console.log(e) })
        return config
    }

    async add(guildId: Snowflake, format: string) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            $push: { format }
        }, { upsert: true, new: true }).catch(() => {})

        return config
    }

    async delete(guildId: Snowflake, format: string) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId, format }, {
            $pull: {
                format
            }
        }, { new: true }).catch(() => {})
        return config
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