import { GuildMember, Snowflake } from "discord.js";
import BaseModule from "../../utils/structures/BaseModule";
import { WelcomeMessageModel } from "../../database/schemas/WelcomeMessage";
import TextFormatter from "../../utils/Formatter";

class WelcomeMessageModule extends BaseModule {
    constructor() {
       super('Welcome Message', true)
    } 

    async run() {
            
    }

    async sendJoinMessage(member: GuildMember) {
        const { guild } = member

        const welcomeConfig = await this.get(guild.id)
        if(!welcomeConfig) return
        const { status, channelId, format } = welcomeConfig
        if(!status || !channelId || !format.length) return

        const channel = await guild.channels.fetch(channelId).catch(() => {})
        if(!channel || !channel.isText()) return

        const welcomeMessage = format[Math.floor(Math.random()*format.length)]
        const formattedWelcomeMessage = TextFormatter(welcomeMessage, { member, guild })

        return channel.send({ content: formattedWelcomeMessage }).catch(() => {})
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