import { CommandInteraction, MessageEmbed } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import Guilds from "../../modules/Guilds";
import { localeList, translate } from "../../utils/languages/languages";
import { palette } from "../../utils/utils";

export default class LanguageCommand extends BaseCommand {
    constructor() {
        super(
            'language',
            'CHAT_INPUT',
            {
                en: "Manage bot's language on this server",
                pl: 'Zarządzanie językiem bota na tym serwerze'
            },
            [
                {
                    name: 'change',
                    description: "Changes bot's language on this server",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'lang',
                            description: 'Language to change',
                            type: 'STRING',
                            required: true,
                            choices: localeList().map(lang => ({ name: translate(lang, 'name'), value: lang }))
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId) return

        const chosenLanguage = interaction.options.get('lang')!.value

        const { language } = await Guilds.config.set(interaction.guildId, { language: chosenLanguage });
        const embed = new MessageEmbed()
            .setColor(palette.success)
            .setDescription(translate(language, "cmd.languageChange", "`" + language + "`"));

        interaction.reply({
            embeds: [embed]
        })
    }
}