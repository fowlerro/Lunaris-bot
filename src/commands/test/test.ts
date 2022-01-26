import { CommandInteraction } from "discord.js";
import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
import Profiles from "../../modules/Profiles";
import levelRewards from "../../modules/Levels/levelRewards";

import BaseCommand from "../../utils/structures/BaseCommand";
import TextFormatter from "../../utils/Formatters/Formatter";
import { StatisticChannelsModel } from "../../database/schemas/StatisticChannels";

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

        const res = await StatisticChannelsModel.create({
            guildId: interaction.guildId,
            channels: [{
                channelId: "935890742025535519",
                format: "{{DateNow}}"
            }]
        })
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}