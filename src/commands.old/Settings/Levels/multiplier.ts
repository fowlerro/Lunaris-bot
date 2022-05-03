import { CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../modules/Levels";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";

export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const multiplier = interaction.options.getNumber('value')
    if(!multiplier) return sendMultiplier(interaction)
    if(multiplier <= 0 || multiplier > 5) return handleCommandError(interaction, 'general.error')

    const newConfig = await Levels.setMultiplier(interaction.guildId!, multiplier)
    if(!newConfig) return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.level.multiplier.set', language))

    return interaction.reply({
        embeds: [embed]
    }).catch(logger.error)
}

async function sendMultiplier(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    const config = await Levels.get(interaction.guildId!)
    if(!config) return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(t('command.level.multiplier.display', language, { multiplier: config.multiplier.toString() }))

    return interaction.reply({
        embeds: [embed]
    }).catch(logger.error)
}