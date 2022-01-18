import { GuildMember, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";

import { WelcomeMessageModel } from "../../database/schemas/WelcomeMessage";
import TextFormatter from "../../utils/Formatter";

import { GroupedWelcomeMessageFormats, WelcomeMessageAction, WelcomeMessageFormat } from "types";

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

    async add(guildId: Snowflake, format: WelcomeMessageFormat) {
        if(!guildId) return
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
            $push: { formats: format }
        }, { upsert: true, new: true }).catch(() => {})

        return config
    }

    async delete(guildId: Snowflake, format: WelcomeMessageFormat) {
        if(!guildId) return
        console.log({ format })
        const config = await WelcomeMessageModel.findOneAndUpdate({ guildId, 'formats.message': format.message, 'formats.action': format.action }, {
            $pull: {
                formats: {
                    message: format.message,
                    action: format.action
                }
            }
        }, { new: true }).catch(() => {})
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