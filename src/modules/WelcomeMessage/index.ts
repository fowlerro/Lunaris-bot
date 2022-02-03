import { GuildMember, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { WelcomeMessageDocument, WelcomeMessageModel } from "../../database/schemas/WelcomeMessage";
import TextFormatter from "../../utils/Formatters/Formatter";
import type { GroupedWelcomeMessageFormats, WelcomeMessage, WelcomeMessageAction, WelcomeMessageFormat } from "types";

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

        const channel = await guild.channels.fetch(channels[action]).catch(logger.error)
        if(!channel || !channel.isText()) return

        const welcomeMessage = actionFormats[Math.floor(Math.random() * actionFormats.length)]
        const formattedWelcomeMessage = TextFormatter(welcomeMessage.message, { member, guild })

        return channel.send({ content: formattedWelcomeMessage }).catch(logger.error)
    }

    async get(guildId: Snowflake): Promise<WelcomeMessage | null> {
        if(!guildId) return null

        const config = await cache.welcomeMessages.get<WelcomeMessage>(guildId)
        if(config) return config

        const document = await WelcomeMessageModel.findOne({ guildId }).catch(logger.error)
        if(!document) return this.create(guildId)

        await this.setCache(document)
        return document.toObject()
    }

    async add(guildId: Snowflake, format: WelcomeMessageFormat): Promise<WelcomeMessage | null> {
        if(!guildId) return null

        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            $push: { formats: format }
        }, { upsert: true, new: true, runValidators: true }).catch(logger.error)
        if(!config) return null

        await this.setCache(config)
        return config.toObject()
    }

    async delete(guildId: Snowflake, format: WelcomeMessageFormat): Promise<WelcomeMessage | null> {
        if(!guildId) return null

        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId, 'formats.message': format.message, 'formats.action': format.action }, {
            $pull: {
                formats: {
                    message: format.message,
                    action: format.action
                }
            }
        }, { new: true }).catch(logger.error)
        if(!config) return null

        await this.setCache(config)
        return config.toObject()
    }

    async set(guildId: Snowflake, action: WelcomeMessageAction, textChannelId?: Snowflake): Promise<WelcomeMessage | null> {
        if(!guildId) return null
        const channel = `channels.${action}`
        
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            [channel]: textChannelId || null
        }, { upsert: true, new: true, runValidators: true }).catch(logger.error)
        if(!config) return null

        await this.setCache(config)
        return config.toObject()
    }

    async setCache(document: WelcomeMessageDocument) {
        const config = document.toObject()
        delete config._id
        delete config.__v

        return cache.welcomeMessages.set<WelcomeMessage>(config.guildId, config)
    }

    async list(guildId: Snowflake, action?: WelcomeMessageAction | null): Promise<WelcomeMessageFormat[] | GroupedWelcomeMessageFormats | null> {
        if(!guildId) return null
        const config = await this.get(guildId)
        if(!config) return action ? [] as WelcomeMessageFormat[] : {} as GroupedWelcomeMessageFormats
        if(action) return config.formats.filter(format => format.action === action)

        return config.formats.reduce((prev, curr) => {
            if(!prev[curr.action]) prev[curr.action] = []
            prev[curr.action].push(curr)
            return prev
        }, {} as GroupedWelcomeMessageFormats)
    }

    async create(guildId: Snowflake): Promise<WelcomeMessage | null> {
        const document = await WelcomeMessageModel.create({ guildId }).catch(logger.error)
        if(!document) return null

        await this.setCache(document)
        return document.toObject()
    }
}

export default new WelcomeMessageModule()