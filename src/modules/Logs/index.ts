import { ButtonInteraction, MessageActionRow, MessageEmbed, MessageEmbedOptions, Snowflake, TextChannel } from "discord.js";

import { GuildLogs, GuildLogsModel } from "../../database/schemas/GuildLogs";
import TextFormatter from "../../utils/Formatters/Formatter";
import BaseModule from "../../utils/structures/BaseModule";
import { getLocale } from "../../utils/utils";
import type { LocalePhrase } from "../../types/locales";
import type { Language } from "types";

import Embeds from "../Embeds";
import actions from "./actions";
import templates from "./templates";

export type Templates = typeof templates

class LogsModule extends BaseModule {
    constructor() {
        super('Logs', true)
    }

    async run() {}

    async get(guildId: Snowflake): Promise<GuildLogs | null> {
        const json = await redis.logConfigs.getEx(guildId, { EX: 60 * 10 })
        if(json) return JSON.parse(json) as GuildLogs

        const document = await GuildLogsModel.findOne({ guildId }).select('-_id -__v').catch(logger.error)
        if(!document) return this.create(guildId)

        const config = document.toObject()
        await redis.logConfigs.setEx(guildId, 60 * 10, JSON.stringify(config))
        return config
    }

    async set(guildId: Snowflake, category: keyof Templates, channelId?: Snowflake): Promise<GuildLogs | null> {
        if(!Object.keys(templates).includes(category)) return null

        const document = await GuildLogsModel.findOneAndUpdate({ guildId }, {
            $set: {
                [`${category}.channelId`]: channelId
            }
        }, { new: true, upsert: true, runValidators: true }).select('-_id -__v').catch(logger.error)
        if(!document) return null

        const config = document.toObject()
        await redis.logConfigs.setEx(guildId, 60 * 10, JSON.stringify(config))
        return config
    }

    async toggle(guildId: Snowflake, category: keyof Templates, log: string, value: boolean): Promise<GuildLogs | null> {
        if(!Object.keys(templates).includes(category)) return null
        if(!Object.keys(templates[category]).includes(log)) return null

        const document = await GuildLogsModel.findOneAndUpdate({ guildId }, {
            $set: {
                [`${category}.logs.${log}`]: value
            }
        }, { new: true, upsert: true, runValidators: true }).select('-_id -__v').catch(logger.error)
        if(!document) return null

        const config = document.toObject()
        await redis.logConfigs.setEx(guildId, 60 * 10, JSON.stringify(config))
        return config
    }

    async create(guildId: Snowflake): Promise<GuildLogs | null> {
        const document = await GuildLogsModel.create({ guildId }).catch(logger.error)
        if(!document) return null

        const config = document.toObject()
        delete config._id
        delete config.__v
        await redis.logConfigs.setEx(guildId, 60 * 10, JSON.stringify(config))
        return config
    }

    async log<T extends keyof Templates>(category: T, type: keyof Templates[T], guildId: Snowflake, vars: any) {
        const config = await this.get(guildId)
        if(!config) return
        const channelId = config?.[category]?.channelId
        const isLogEnabled = config?.[category]?.logs?.[type] as boolean
        if(!channelId || !isLogEnabled) return
        const guild = await client.guilds.fetch(guildId).catch(logger.error)
        if(!guild) return
        const channel = await guild.channels.fetch(channelId).catch(logger.error) as TextChannel | void
        if(!channel) return
        const language = getLocale(guild.preferredLocale)

        const embed = this.formatTemplate(category, type, language, vars)

        const checkedEmbed = await Embeds.checkLimits(embed, false)
        if(checkedEmbed.error) return
        const actionButtons = this.addActions(category, type, language, vars)

        channel.send({
            embeds: [checkedEmbed.pages[0]],
            components: actionButtons ? [actionButtons] : undefined
        }).catch(logger.error)
    }

    formatTemplate<T extends keyof Templates>(category: T, type: keyof Templates[T], language: Language, vars: any) {
        const template = templates[category][type] as MessageEmbedOptions

        const fields = template.fields?.map(value => ({ name: t(value.name as LocalePhrase, language), value: TextFormatter(value.value, vars), inline: value.inline }))
        const embed = new MessageEmbed()
        
        template?.color && embed.setColor(template.color)
        template?.title && embed.setTitle(t(template.title as LocalePhrase, language))
        template?.author?.name && embed.setAuthor({ name: t(template.author.name as LocalePhrase, language), iconURL: TextFormatter(template.author?.iconURL || "", vars), url: template.author?.url })
        template?.description && embed.setDescription(t(template.description as LocalePhrase, language))
        fields && embed.addFields(...fields)
        template?.image?.url && embed.setImage(TextFormatter(template.image.url, vars))
        template?.thumbnail?.url && embed.setThumbnail(TextFormatter(template.thumbnail.url, vars))
        template?.timestamp && embed.setTimestamp(template.timestamp)

        return embed
    }

    addActions<T extends keyof Templates>(category: T, type: keyof Templates[T], language: Language, vars: any) {
        // @ts-ignore
        const actionButtons = actions?.[category]?.[type]?.addActions?.(language, vars)
        if(!actionButtons || !actionButtons.length) return
        const actionRow = new MessageActionRow()
            .setComponents(actionButtons)

        return actionRow
    }

    async handleAction(interaction: ButtonInteraction) {
        const customId = interaction.customId
        const [log, category, logType] = customId.split('-')
        if(!log || log !== 'logs' || !category || !logType) return
        // @ts-ignore
        actions?.[category]?.[logType]?.handleActions?.(interaction)
    }
}

export default new LogsModule()