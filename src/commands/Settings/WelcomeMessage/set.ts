import { CommandInteraction, MessageEmbed } from "discord.js";

import WelcomeMessage from "../../../modules/WelcomeMessage";
import { getLocale, palette } from "../../../utils/utils";
import { handleError } from "./index";
import type { WelcomeMessageAction } from "types";


export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const action = interaction.options.getString('action', true) as WelcomeMessageAction
    const channel = interaction.options.getChannel('channel')

    const config = await WelcomeMessage.set(interaction.guildId!, action, channel?.id)
    if(!config) return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(channel ? 'command.welcome.set' : 'command.welcome.disabled', language));

    return interaction.reply({
        embeds: [embed]
    })
}