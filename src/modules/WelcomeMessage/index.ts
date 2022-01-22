import { GuildMember, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";

import { WelcomeMessageDocument, WelcomeMessageModel } from "../../database/schemas/WelcomeMessage";
import TextFormatter from "../../utils/Formatter";

import { GroupedWelcomeMessageFormats, WelcomeMessage, WelcomeMessageAction, WelcomeMessageFormat } from "types";

class WelcomeMessageModule extends BaseModule {
    constructor() {
        super('Welcome Message', true)
    }
    
    supportedActions = ['join', 'leave']

    async run() {
            
    }

    async sendMessage(member: GuildMember, action: WelcomeMessageAction) {
        const { guild } = member

        const welcomeConfig = await this.get(guild.id)
        if(!welcomeConfig) return
        const { status, channels, formats} = welcomeConfig
        if(!status || !channels[action]) return

        const actionFormats = formats.filter(format => format.action === action)
        if(!actionFormats.length) return

        const channel = await guild.channels.fetch(channels[action]).catch(() => {})
        if(!channel || !channel.isText()) return

        const welcomeMessage = actionFormats[Math.floor(Math.random() * actionFormats.length)]
        const formattedWelcomeMessage = TextFormatter(welcomeMessage.message, { member, guild })

        return channel.send({ content: formattedWelcomeMessage }).catch(() => {})
    }

    async get(guildId: Snowflake) {
        if(!guildId) return
        const json = await redis.welcomeMessages.getEx(guildId, { EX: 60 * 10 })
        if(json) return JSON.parse(json) as WelcomeMessage

        const document = await WelcomeMessageModel.findOne({ guildId }).catch((e) => { console.log(e) })
        if(!document) return this.create(guildId)

        await this.setCache(document)
        return document.toObject() as WelcomeMessage
    }

    async add(guildId: Snowflake, format: WelcomeMessageFormat) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            $push: { formats: format }
        }, { upsert: true, new: true }).catch(() => {})
        if(!config) return

        await this.setCache(config)
        return config
    }

    async delete(guildId: Snowflake, format: WelcomeMessageFormat) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId, 'formats.message': format.message, 'formats.action': format.action }, {
            $pull: {
                formats: {
                    message: format.message,
                    action: format.action
                }
            }
        }, { new: true }).catch(() => {})
        if(!config) return
        await this.setCache(config)
        return config
    }

    async set(guildId: Snowflake, action: WelcomeMessageAction, textChannelId?: Snowflake) {
        if(!guildId) return
        const channel = `channels.${action}`
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            [channel]: textChannelId || null
        }, { upsert: true, new: true }).catch(() => {})
        if(!config) return
        await this.setCache(config)
        return config
    }

    async setCache(document: WelcomeMessageDocument) {
        const config = document.toObject()
        delete config._id
        delete config.__v

        return redis.welcomeMessages.setEx(config.guildId, 60 * 10, JSON.stringify(config))
    }

    async list(guildId: Snowflake, action?: WelcomeMessageAction | null): Promise<WelcomeMessageFormat[] | GroupedWelcomeMessageFormats | undefined> {
        if(!guildId) return
        const config = await this.get(guildId)
        if(!config) return action ? [] as WelcomeMessageFormat[] : {} as GroupedWelcomeMessageFormats
        if(action) return config.formats.filter(format => format.action === action)

        return config.formats.reduce((prev, curr) => {
            if(!prev[curr.action]) prev[curr.action] = []
            prev[curr.action].push(curr)
            return prev
        }, {} as GroupedWelcomeMessageFormats)
    }

    async create(guildId: Snowflake) {
        const document = await WelcomeMessageModel.create({ guildId }).catch(e => { console.log(e) })
        if(!document) return

        await this.setCache(document)
        return document.toObject() as WelcomeMessage
    }
}

export default new WelcomeMessageModule()