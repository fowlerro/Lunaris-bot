import { GuildMember, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";

import { WelcomeMessageDocument, WelcomeMessageModel } from "../../database/schemas/WelcomeMessage";
import TextFormatter from "../../utils/Formatter";

import { GroupedWelcomeMessageFormats, WelcomeMessageAction, WelcomeMessageFormat } from "types";
import { LocalePhrase } from "../../types/locales";

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
        let config = await WelcomeMessageModel.findOne({ guildId }).catch(() => {})
        if(!config) config = await WelcomeMessageModel.create({ guildId }).catch(() => {})
        return config
    }

    async add(guildId: Snowflake, format: WelcomeMessageFormat): Promise<{ config: WelcomeMessageDocument | null, error: LocalePhrase | null }> {
        if(!guildId) return { config: null, error: 'module.welcomeMessages.errors.general' }
        if(format.message.length > 256) return { config: null, error: 'module.welcomeMessages.errors.messageMaxLength' }
        const WelcomeMessages = await this.get(guildId)
        if(!WelcomeMessages) return { config: null, error: 'module.welcomeMessages.errors.general' }
        const messageCount = WelcomeMessages.formats.filter(msg => msg.action === format.action).length
        if(messageCount >= 5) return { config: null, error: 'module.welcomeMessages.errors.maxMessages' }

        WelcomeMessages.formats.push(format)
        const saved = await WelcomeMessages.save().catch(() => {})
        if(!saved) return { config: null, error: 'module.welcomeMessages.errors.general' }

        return { config: saved, error: null }
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
        }, { new: true, runValidators: true }).catch(() => {})
        return config
    }

    async set(guildId: Snowflake, action: WelcomeMessageAction, textChannelId?: Snowflake) {
        if(!guildId) return
        const channel = `channels.${action}`
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            [channel]: textChannelId || null
        }, { upsert: true, new: true }).catch(() => {})

        return config
    }

    async list(guildId: Snowflake, action?: WelcomeMessageAction | null): Promise<WelcomeMessageFormat[] | GroupedWelcomeMessageFormats | undefined> {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOne({ guildId }).catch(() => {})
        if(!config) return action ? [] as WelcomeMessageFormat[] : {} as GroupedWelcomeMessageFormats
        if(action) return config.formats.filter(format => format.action === action)

        return config.formats.reduce((prev, curr) => {
            if(!prev[curr.action]) prev[curr.action] = []
            prev[curr.action].push(curr)
            return prev
        }, {} as GroupedWelcomeMessageFormats)
    }
}

export default new WelcomeMessageModule()