import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";

import Guilds from "../../../modules/Guilds";
import WelcomeMessage from "../../../modules/WelcomeMessage";

import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const message = interaction.options.getString('message', true)

    const deleted = await WelcomeMessage.delete(interaction.guildId!, message)
    const description = deleted ? translate(language, 'cmd.welcome.delete') : translate(language, 'cmd.welcome.error')

    const embed = new MessageEmbed()
        .setColor(deleted ? palette.success : palette.error)
        .setDescription(description);

    return interaction.reply({
        embeds: [embed],
        ephemeral: !Boolean(deleted)
    })
}

export async function deleteAutocomplete(interaction: AutocompleteInteraction) {
    if(!interaction.guildId) return
    const input = interaction.options.getString('message', true)
    const welcomeMessages = await WelcomeMessage.list(interaction.guildId) 

    const options = welcomeMessages?.filter(welcomeMessage => welcomeMessage.includes(input))?.map(welcomeMessage => ({
        name: welcomeMessage, 
        value: welcomeMessage
    }))

    return interaction.respond(options?.splice(0, 25) || [])

}