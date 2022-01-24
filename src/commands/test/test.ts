import { CommandInteraction } from "discord.js";
import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
import Profiles from "../../modules/Profiles";
import levelRewards from "../../modules/xpSystem/levelRewards";

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

        const profile = await Profiles.get(interaction.member.id, interaction.guildId!) as GuildProfileDocument
        await levelRewards(profile, true)
        await levelRewards(profile, false)
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}