import { CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../modules/Levels";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";

export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const format = interaction.options.getString('format')
    if(format && format.length > 256) return handleCommandError(interaction, 'command.level.levelUpMessage.formatTooLong')

    const updatedConfig = await Levels.setLevelUpMessage(interaction.guildId!, format)
    if(!updatedConfig) return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(`command.level.levelUpMessage.${format ? 'set' : 'unset'}`, language));

    return interaction.reply({
        embeds: [embed]
    }).catch(logger.error)
}