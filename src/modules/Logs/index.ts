import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { Language } from "types";
import { LocalePhrase } from "../../types/locales";
import TextFormatter from "../../utils/Formatters/Formatter";
import BaseModule from "../../utils/structures/BaseModule";
import Embeds from "../Embeds";
import actions from "./actions";
import templates from "./templates";

export type Templates = typeof templates

class LogsModule extends BaseModule {
    constructor() {
        super('Logs', true)
    }

    async run() {}

    async log(category: keyof Templates, type: string, guildId: Snowflake, vars: any) {
        const config = { 
            messages: { channelId: "795981046645653524" },
            members: { channelId: "795980843516297216", logs: { join: true, leave: true, ban: true } },
            roles: { channelId: "805536443216822362" },
            channels: { channelId: "795980922553761793" },
            threads: { channelId: "937281497390538762" },
            invites: { channelId: "804820204022399046" },
            emojis: { channelId: "937352424895705168" },
            server: { channelId: "937403455641886811" }
        }

        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return console.log('notGuild')
        const channel = await guild.channels.fetch(config[category].channelId).catch(() => {}) as TextChannel | null
        if(!channel) return console.log('notChannel')
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'

        const embed = this.formatTemplate(category, type, language, vars)

        const checkedEmbed = await Embeds.checkLimits(embed, false)
        if(checkedEmbed.error) return
        const actionButtons = this.addActions(category, type, language, vars)

        channel.send({
            embeds: [checkedEmbed.pages[0]],
            components: actionButtons ? [actionButtons] : undefined
        })
    }

    formatTemplate(category: keyof Templates, type: string, language: Language, vars: any) {
        const template = templates[category][type]

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

    addActions(category: keyof Templates, type: string, language: Language, vars: any) {
        
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
        actions?.[category as keyof Templates]?.[logType]?.handleActions?.(interaction)
    }
}

export default new LogsModule()