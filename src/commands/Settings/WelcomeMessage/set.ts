import { CommandInteraction, MessageEmbed } from "discord.js";

import Guilds from "../../../modules/Guilds";
import WelcomeMessage from "../../../modules/WelcomeMessage";
import { handleError } from "./index";

import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

import type { WelcomeMessageAction } from "types";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const action = interaction.options.getString('action', true) as WelcomeMessageAction
    const channel = interaction.options.getChannel('channel')

    const config = await WelcomeMessage.set(interaction.guildId!, action, channel?.id)
    if(!config) return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(translate(language, channel ? 'cmd.welcome.set' : 'cmd.welcome.disabled'));

    return interaction.reply({
        embeds: [embed]
    })
}