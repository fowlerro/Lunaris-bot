import { CommandInteraction, MessageEmbed } from "discord.js";

import Guilds from "../../../modules/Guilds";
import WelcomeMessage from "../../../modules/WelcomeMessage";

import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const channel = interaction.options.getChannel('channel', true)

    const config = await WelcomeMessage.set(interaction.guildId!, channel.id)

    const description = config ? translate(language, 'cmd.welcome.set') : translate(language, 'cmd.welcome.error')

    const embed = new MessageEmbed()
        .setColor(config ? palette.success : palette.error)
        .setDescription(description);

    return interaction.reply({
        embeds: [embed],
        ephemeral: !Boolean(config)
    })
}