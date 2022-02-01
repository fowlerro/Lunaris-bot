import { CommandInteraction, MessageEmbed } from "discord.js";
import { Language } from "types";
import Logs from "../../../modules/Logs";
import templates from "../../../modules/Logs/templates";
import { palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const language = interaction.guild?.preferredLocale === 'pl' ? 'pl' : 'en'
    const category = interaction.options.getString('category', true)
    const channel = interaction.options.getChannel('channel')
    if(!(Object.keys(templates)).includes(category)) return wrongCategory(interaction, language)

    const config = await Logs.set(interaction.guildId!, category as any, channel?.id)
    if(!config) return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.logs.set', language))

    return interaction.reply({
        embeds: [embed]
    }).catch(console.error)
}

export function wrongCategory(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.logs.wrongCategory', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    }).catch(console.error)
}

function handleError(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.logs.error', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    }).catch(console.error)
}