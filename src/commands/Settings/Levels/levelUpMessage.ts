import { CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../modules/Levels";
import { getLocale, palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const format = interaction.options.getString('format')
    if(format && format.length > 256) return formatTooLong(interaction)

    const updatedConfig = await Levels.setLevelUpMessage(interaction.guildId!, format)
    if(!updatedConfig) return handleError(interaction)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(`command.level.levelUpMessage.${format ? 'set' : 'unset'}`, language));

    return interaction.reply({
        embeds: [embed]
    })
}

function formatTooLong(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)

    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.level.levelUpMessage.formatTooLong', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
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