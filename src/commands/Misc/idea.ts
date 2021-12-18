import { CommandInteraction } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import { IdeaModel } from "../../database/schemas/Ideas";
import Guilds from "../../modules/Guilds";
import { translate } from "../../utils/languages/languages";

export default class IdeaCommand extends BaseCommand {
    constructor() {
        super(
            'idea',
            'CHAT_INPUT',
            {
                en: "You can submit an idea or bug for the bot, if you think something should be added or changed",
                pl: "Jeśli masz pomysł, co powinno zostać dodane, usunięte lub zmienione w bocie, możesz przesłać ten pomysł, a się nad nim zastanowię"
            },
            [
                {
                    name: 'description',
                    description: 'A description for your idea or finded bug',
                    type: 'STRING',
                    required: true
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {

        const { language } = await Guilds.config.get(interaction.guildId)
        const description = interaction.options.getString('description', true)
        if(!description) return

        await IdeaModel.create({ description })

        interaction.reply({
            content: translate(language, 'cmd.idea.submitted')
        })
    }
}