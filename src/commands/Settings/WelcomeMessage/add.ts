import { CommandInteraction, MessageEmbed } from "discord.js";

import WelcomeMessage from "../../../modules/WelcomeMessage";
import Guilds from "../../../modules/Guilds";
import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const format = interaction.options.getString('format', true)

    const welcomeConfig = await WelcomeMessage.add(interaction.guildId!, format)

    const description = welcomeConfig ? translate(language, "cmd.welcome.add") : translate(language, "cmd.welcome.error")

    const embed = new MessageEmbed()
        .setColor(welcomeConfig ? palette.success : palette.error)
        .setDescription(description);

    interaction.reply({
        embeds: [embed],
        ephemeral: !Boolean(welcomeConfig)
    })
}