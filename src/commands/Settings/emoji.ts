import { AutocompleteInteraction, CommandInteraction, MessageEmbed, Permissions } from "discord.js";
import Guilds from "../../modules/Guilds";
import { translate } from "../../utils/languages/languages";

import BaseCommand from "../../utils/structures/BaseCommand";
import { palette } from "../../utils/utils";

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
        if(!interaction.guild) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) return
        const subcommand = interaction.options.getSubcommand(true)

        const { language } = await Guilds.config.get(interaction.guildId)

        if(subcommand === 'add') {
            const url = interaction.options.getString('url', true)
            const name = interaction.options.getString('name', true)

            const newEmoji = await interaction.guild.emojis.create(url, name).catch(() => {})

            const description = newEmoji ?
                translate(language, 'cmd.emoji.add', name)
                : translate(language, 'cmd.emoji.error')

            const embed = new MessageEmbed()
                .setColor(newEmoji ? palette.success : palette.error)
                .setDescription(description);
    
            return interaction.reply({
                embeds: [embed],
                ephemeral: !Boolean(newEmoji)
            })
        }

        if(subcommand === 'delete') {
            const emojiId = interaction.options.getString('emoji', true)
            const reason = interaction.options.getString('reason') || undefined

            const emoji = await interaction.guild.emojis.fetch(emojiId).catch(() => {})
            if(!emoji || !emoji.deletable) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'cmd.emoji.notDeletable'))

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }

            const deletedEmoji = await emoji.delete(reason).catch(() => {})
            const description = deletedEmoji ? 
                translate(language, 'cmd.emoji.delete', deletedEmoji.name)
                : translate(language, 'cmd.emoji.error')

            const embed = new MessageEmbed()
                .setColor(deletedEmoji ? palette.success : palette.error)
                .setDescription(description)

            return interaction.reply({
                embeds: [embed],
                ephemeral: !Boolean(deletedEmoji)
            })
        }
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        const inputEmoji = interaction.options.getString('emoji', true)
        const guildEmojis = await interaction.guild?.emojis.fetch()
        const emoji = guildEmojis?.filter(emoji => (emoji.name?.includes(inputEmoji) || false))

        const options = emoji?.map(emoji => ({
            name: emoji.name!,
            value: emoji.id
        }))!

        return interaction.respond(options.splice(0, 25))
    }
}