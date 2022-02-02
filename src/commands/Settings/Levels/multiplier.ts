import { CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../modules/Levels";
import { getLocale, palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const multiplier = interaction.options.getNumber('value')
    if(!multiplier) return sendMultiplier(interaction)
    if(multiplier <= 0 || multiplier > 5) return handleError(interaction)

    const newConfig = await Levels.setMultiplier(interaction.guildId!, multiplier)
    if(!newConfig) return handleError(interaction)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.level.multiplier.set', language))

    return interaction.reply({
        embeds: [embed]
    })
}

async function sendMultiplier(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    const config = await Levels.get(interaction.guildId!)
    if(!config) return handleError(interaction)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(t('command.level.multiplier.display', language, { multiplier: config.multiplier.toString() }))

    return interaction.reply({
        embeds: [embed]
    })
}

function handleError(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)

    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.level.levelUpMessage.error', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}