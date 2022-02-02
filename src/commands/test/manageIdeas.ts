import { CommandInteraction, MessageEmbed } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import Embeds from "../../modules/Embeds";
import { IdeaModel } from "../../database/schemas/Ideas";
import { palette } from "../../utils/utils";

export default class ManageIdeasCommand extends BaseCommand {
    constructor() {
        super(
            'manage-ideas',
            'CHAT_INPUT',
            {
                en: "List of submitted ideas",
                pl: "Lista wysłanych pomysłów"
            },
            [
                {
                    name: 'list',
                    description: 'List of ideas',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'delete',
                    description: 'Deletes an idea',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'id',
                            description: 'id of the idea',
                            type: 'STRING',
                            required: true
                        }
                    ]
                }
            ],
            true,
            true
        );
    }

    async run(interaction: CommandInteraction) {
        const subcommand = interaction.options.getSubcommand(true)

        if(subcommand === 'list') {
            const ideas = await IdeaModel.find()
    
            const fields = ideas.map(idea => ({
                name: new Date(idea.createdAt).toLocaleString(),
                value: `Id: ${idea._id}\ndescription: ${idea.description}`
            }))
    
            const embed = new MessageEmbed()
                .setColor(palette.info)
            fields.length ? embed.addFields(fields) : embed.setDescription('None')
    
            const embeds = Embeds.checkLimits(embed, true, 9)
            if(embeds.error)
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
    
            Embeds.pageInteractionEmbeds(null, embeds.pages, interaction, 1, true)
        }

        if(subcommand === 'delete') {
            const id = interaction.options.getString('id', true)
            const deletedIdea = await IdeaModel.findOneAndDelete({ _id: id })
            if(!deletedIdea) return
            
            return interaction.reply({
                content: 'An idea has been deleted'
            })
        }
    }
}