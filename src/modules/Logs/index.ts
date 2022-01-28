import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { Language } from "types";
import { LocalePhrase } from "../../types/locales";
import TextFormatter from "../../utils/Formatters/Formatter";
import BaseModule from "../../utils/structures/BaseModule";
import templates from "./templates";
import { Config } from "./types";



class LogsModule extends BaseModule {
    constructor() {
        super('Logs', true)
    }

    async run() {}

    async log(category: keyof Config, type: string, guildId: Snowflake, vars: any) {
        const config: Config = { members: { channelId: "795980843516297216", logs: { memberJoin: true, memberBan: true } } }

        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return console.log('notGuild')
        const channel = await guild.channels.fetch(config[category].channelId).catch(() => {}) as TextChannel | null
        if(!channel) return console.log('notChannel')
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'

        const embed = this.formatTemplate(category, type, language, vars)

        const actionButtons = this.addActions(vars)

        channel.send({
            embeds: [embed],
            components: [actionButtons]
        })
    }

    formatTemplate(category: keyof Config, type: string, language: Language, vars: any) {
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

    addActions(vars: any) {
        const muteUser = new MessageButton()
            .setLabel('Mute member')
            .setStyle('LINK')
            .setURL('discord://-/settings/advanced')

        const actionRow = new MessageActionRow()
            .setComponents([muteUser])

        return actionRow
    }

    async handleAction(interaction: ButtonInteraction) {
        const customId = interaction.customId
        const [_, logType, memberId] = customId.split('-')

        
    }
}

export default new LogsModule()