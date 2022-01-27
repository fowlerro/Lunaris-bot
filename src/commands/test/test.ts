import { CommandInteraction } from "discord.js";
import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
import Profiles from "../../modules/Profiles";
import levelRewards from "../../modules/Levels/levelRewards";

import BaseCommand from "../../utils/structures/BaseCommand";
import Logs from "../../modules/Logs";

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
        if(!interaction.guildId) return
        if(!interaction.member || !('guild' in interaction.member)) return

        await Logs.log('members', 'memberJoin', interaction.guildId)
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}