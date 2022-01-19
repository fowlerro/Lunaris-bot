import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";

import Guilds from "../../../modules/Guilds";
import WelcomeMessage from "../../../modules/WelcomeMessage";

import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

import type { WelcomeMessageAction } from 'types'
import { handleError } from ".";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const action = interaction.options.getString('action', true) as WelcomeMessageAction
    const message = interaction.options.getString('message', true)

    const deleted = await WelcomeMessage.delete(interaction.guildId!, { message, action })
    if(!deleted) return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(translate(language, 'cmd.welcome.delete'));

    return interaction.reply({
        embeds: [embed]
    })
}

export async function deleteAutocomplete(interaction: AutocompleteInteraction) {
    if(!interaction.guildId) return
    const action = interaction.options.getString('action', true) as WelcomeMessageAction
    const input = interaction.options.getString('message', true)
    const welcomeMessages = await WelcomeMessage.list(interaction.guildId, action)
    if(!Array.isArray(welcomeMessages)) return

    const options = welcomeMessages?.filter(welcomeMessage => welcomeMessage.message.includes(input))?.map(welcomeMessage => ({
        name: welcomeMessage.message,
        value: welcomeMessage.message
    }))

    return interaction.respond(options?.splice(0, 25) || [])

}