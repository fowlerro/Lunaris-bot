import { CommandInteraction } from "discord.js";
import { WelcomeMessageAction } from "types";
import { GuildConfigModel } from "../../database/schemas/GuildConfig";
import WelcomeMessage from "../../modules/WelcomeMessage";

import BaseCommand from "../../utils/structures/BaseCommand";

export default class TestCommand extends BaseCommand {
    constructor() {
        super(
            'test',
            'CHAT_INPUT',
            {
                en: 'Testing command',
                pl: 'Komenda testowa'
            },
            [
                {
                    name: 'action',
                    description: 'action',
                    type: 'STRING'
                }
            ],
            true,
            true
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.member || !('guild' in interaction.member)) return

        const action = interaction.options.getString('action', true) as WelcomeMessageAction
        await WelcomeMessage.sendMessage(interaction.member, action)
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}