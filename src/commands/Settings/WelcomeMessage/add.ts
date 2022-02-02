import { CommandInteraction, MessageEmbed } from "discord.js";

import WelcomeMessage from "../../../modules/WelcomeMessage";
import { getLocale, palette } from "../../../utils/utils";
import { handleError } from "./index";
import type { WelcomeMessageFormat } from "types";


export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const action = interaction.options.getString('action', true)
    const format = interaction.options.getString('format', true)
    if(!WelcomeMessage.supportedActions.includes(action)) return handleError(interaction, language)

    const welcomeConfig = await WelcomeMessage.add(interaction.guildId!, { message: format, action: action as WelcomeMessageFormat['action'] })
    if(!welcomeConfig) return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t("command.welcome.add", language));

    interaction.reply({
        embeds: [embed]
    })
}

