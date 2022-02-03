import { CommandInteraction, MessageEmbed } from "discord.js";

import Logs from "../../../modules/Logs";
import templates from "../../../modules/Logs/templates";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";

export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const category = interaction.options.getString('category', true)
    const channel = interaction.options.getChannel('channel')
    if(!(Object.keys(templates)).includes(category)) return handleCommandError(interaction, 'command.logs.wrongCategory')

    const config = await Logs.set(interaction.guildId!, category as any, channel?.id)
    if(!config) return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.logs.set', language))

    return interaction.reply({
        embeds: [embed]
    }).catch(console.error)
}