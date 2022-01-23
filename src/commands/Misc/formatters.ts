
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import Embeds from "../../modules/Embeds";
import { IFormatter, supportedFormatters } from "../../utils/Formatters/Formatter";
import BaseCommand from "../../utils/structures/BaseCommand";
import { capitalize, palette } from "../../utils/utils";

export default class FormatterCommand extends BaseCommand {
    constructor() {
        super(
            'formatters',
            'CHAT_INPUT',
            {
                en: "List of all available formatters, you can use in some modules like Welcome Message",
                pl: "Lista dostępnych formatowań, których możesz użyć w modułach takich jak Wiadomości Powitalne"
            },
            [],
            true, true
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId) return
        const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'

        const formatters = supportedFormatters.reduce((prev, curr, index) => {
            if(!prev[curr.category]) prev[curr.category] = []
            prev[curr.category].push(`**${curr.name}** - ${curr.description[language]}`)
            return prev
        }, {} as { [category in IFormatter['category']]: string[] })

        const embedPages = Object.entries(formatters).map(([ key, value ]) => {
            return new MessageEmbed()
                .setColor(palette.info)
                .setTitle(t('command.formatters.title', language, { category: capitalize(key) }))
                .setDescription(value.join('\n'))
        })

        embedPages.unshift(embedPages[0])

        Embeds.pageInteractionEmbeds(null, embedPages, interaction, 1, false, true)
    }
}