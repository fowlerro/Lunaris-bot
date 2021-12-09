import { Channel, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import Guilds from "../../modules/Guilds";
import { translate } from "../../utils/languages/languages";

import BaseCommand from "../../utils/structures/BaseCommand";
import { palette } from "../../utils/utils";

export default class TestCommand extends BaseCommand {
    constructor() {
        super(
            'purge',
            'CHAT_INPUT',
            {
                en: "Removes many messages at once",
                pl: "Usuwa wiele wiadomości na raz"
            },
            [
                {
                    name: 'count',
                    description: 'How many messages should be removed',
                    type: 'INTEGER',
                    required: true,
                },
                {
                    name: 'user',
                    description: 'A user whose messages will be removed',
                    type: 'USER'
                },
                {
                    name: 'channel',
                    description: 'A text channel in which messages will be removed',
                    type: 'CHANNEL'
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        let count = interaction.options.getInteger('count')!
        const user = interaction.options.getUser('user')
        const channel = interaction.options.getChannel('channel') || interaction.channel!

        if(count > 100) count = 100
        if(count < 1) count = 1

        const { language } = await Guilds.config.get(interaction.guildId!)
        // if(channel.type !== 'GUILD_TEXT') return interaction.reply({ content: translate(language, 'cmd.purge.wrongChannel'), ephemeral: true })
        if(!(channel instanceof TextChannel)) return interaction.reply({ content: translate(language, 'cmd.purge.wrongChannel'), ephemeral: true })

        let fetched = await channel.messages.fetch({ limit: user ? 100 : count }, { cache: false });
        if(user) {
            let filterCount = 0;
            fetched = fetched.filter(message => message.author.id === user.id).filter(() => {
                filterCount ++;
                return filterCount <= count;
            })
        }
        const deletedMessages = await channel.bulkDelete(fetched, true); // TODO Returning inproper messages collection

        const descriptionType = user && interaction.options.getChannel('channel') ? 'user-channel' : user ? 'user' : interaction.options.getChannel('channel') ? 'channel' : 'default'

        const embed = new MessageEmbed()
            .setColor(palette.success)
            .setDescription(`✅ ${translate(language, `cmd.purge.success.${descriptionType}`, deletedMessages.size, user?.id, channel.id)}`)

        interaction.reply({
            embeds: [embed]
        })
    }
}