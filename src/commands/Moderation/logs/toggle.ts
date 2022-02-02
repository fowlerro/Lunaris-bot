import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import Logs, { Templates } from "../../../modules/Logs";
import templates from "../../../modules/Logs/templates";
import { wrongCategory } from "./set";
import { Language } from "types";
import { getLocale, palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const category = interaction.options.getString('category', true)
    const log = interaction.options.getString('log', true)
    const value = interaction.options.getBoolean('value', true)
    if(!Object.keys(templates).includes(category)) return wrongCategory(interaction, language)
    if(!Object.keys(templates[category as keyof Templates]).includes(log)) return wrongLog(interaction, language)

    const config = await Logs.get(interaction.guildId!)
    if(config && config?.[category as keyof Templates]?.logs?.[log] == value) return alreadyToggled(interaction, language, value)

    const updated = await Logs.toggle(interaction.guildId!, category as keyof Templates, log, value)
    if(!updated) return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(`command.logs.${value ? 'enabled' : 'disabled'}`, language))

    return interaction.reply({
        embeds: [embed]
    }).catch(console.error)
}

export function wrongLog(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.logs.invalidLog', language))

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

export function alreadyToggled(interaction: CommandInteraction, language: Language, value: boolean) {
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(t(`command.logs.already${value ? 'Enabled' : 'Disabled'}`, language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    }).catch(console.error)
}

export async function autocompleteToggle(interaction: AutocompleteInteraction) {
    const category = interaction.options.getString('category', true)
    const input = interaction.options.getString('log', true)
    if(!Object.keys(templates).includes(category)) return

    const logs = Object.keys(templates[category as keyof Templates])
    
    const options = logs.filter(log => log.includes(input)).map(log => ({
        name: log,
        value: log
    }))

    return interaction.respond(options.splice(0, 25)).catch(console.error)
}