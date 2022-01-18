import { CommandInteraction, MessageEmbed } from "discord.js";

import WelcomeMessage from "../../../modules/WelcomeMessage";
import Guilds from "../../../modules/Guilds";

import { handleError } from "./index";
import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

import { WelcomeMessageFormat } from "types";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const action = interaction.options.getString('action', true)
    const format = interaction.options.getString('format', true)
    if(!WelcomeMessage.supportedActions.includes(action)) return handleError(interaction, language)

    const welcomeConfig = await WelcomeMessage.add(interaction.guildId!, { message: format, action: action as WelcomeMessageFormat['action'] })
    if(!welcomeConfig) return handleError(interaction, language)

    const description = translate(language, "cmd.welcome.add")

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(description);

    interaction.reply({
        embeds: [embed]
    })
}

