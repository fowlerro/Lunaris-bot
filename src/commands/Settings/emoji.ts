import { AutocompleteInteraction, CommandInteraction, MessageEmbed, Permissions } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import { getLocale, palette } from "../../utils/utils";
import { handleCommandError } from "../errors";

export default class EmojiCommand extends BaseCommand {
    constructor() {
        super(
            'emoji',
            'CHAT_INPUT',
            {
                en: "Manage emojis of this server",
                pl: 'Zarządzanie emotkami tego serwera'
            },
            [
                {
                    name: 'add',
                    description: "Adds emoji to server",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'url',
                            description: 'The URL of an emoji',
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'name',
                            description: "Name of the added emoji",
                            type: "STRING",
                            required: true
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: 'Deletes emoji from server',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'emoji',
                            description: 'An emoji to be deleted',
                            type: 'STRING', // TODO display emoji instead of name
                            required: true,
                            autocomplete: true
                        },
                        {
                            name: 'reason',
                            description: 'Reason for the emoji deletion',
                            type: 'STRING'
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId || !interaction.guild || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) return handleCommandError(interaction, 'command.executorWithoutPermission')
        const subcommand = interaction.options.getSubcommand(true)

        const language = getLocale(interaction.guildLocale)

        if(subcommand === 'add') {
            const url = interaction.options.getString('url', true)
            const name = interaction.options.getString('name', true)

            const newEmoji = await interaction.guild.emojis.create(url, name).catch(console.error)
            if(!newEmoji) return handleCommandError(interaction, 'general.error')

            const description = t('command.emoji.add', language, { emojiName: name })

            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(description);
    
            return interaction.reply({
                embeds: [embed]
            }).catch(console.error)
        }

        if(subcommand === 'delete') {
            const emojiId = interaction.options.getString('emoji', true)
            const reason = interaction.options.getString('reason') || undefined

            const emoji = await interaction.guild.emojis.fetch(emojiId).catch(console.error)
            if(!emoji || !emoji.deletable) return handleCommandError(interaction, 'command.emoji.notDeletable')

            const deletedEmoji = await emoji.delete(reason).catch(console.error)
            if(!deletedEmoji) return handleCommandError(interaction, 'general.error')
            const description = t('command.emoji.delete', language, { emojiName: deletedEmoji.name || "" })

            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(description)

            return interaction.reply({
                embeds: [embed]
            }).catch(console.error)
        }
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        const inputEmoji = interaction.options.getString('emoji', true)
        const guildEmojis = await interaction.guild?.emojis.fetch().catch(console.error)
        const emoji = guildEmojis?.filter(emoji => (emoji.name?.includes(inputEmoji) || false))

        const options = emoji?.map(emoji => ({
            name: emoji.name!,
            value: emoji.id
        }))!

        return interaction.respond(options.splice(0, 25)).catch(console.error)
    }
}