import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import { IdeaModel } from "../../database/schemas/Ideas";
import { getLocale, palette } from "../../utils/utils";
import { handleCommandError } from "../errors";
import { testGuildId } from "../../bot";

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
        if(!interaction.guildId) return
        const language = getLocale(interaction.guildLocale)
        const description = interaction.options.getString('description', true)

        const newIdea = await IdeaModel.create({ description }).catch(console.error)
        if(!newIdea) return handleCommandError(interaction, 'general.error')

        interaction.reply({
            content: t('command.idea.submitted', language)
        }).catch(console.error)

        const testGuild = await client.guilds.fetch(testGuildId).catch(console.error)
        if(!testGuild) return
        const ideaChannelId = "921827277203992686"
        const ideaChannel = (await testGuild.channels.fetch(ideaChannelId).catch(console.error)) as TextChannel | null | void
        if(!ideaChannel) return handleCommandError(interaction, 'general.error')

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setDescription(`Id: ${newIdea._id}\nDescription: ${newIdea.description}`)

        ideaChannel.send({
            embeds: [embed]
        }).catch(console.error)
    }
}