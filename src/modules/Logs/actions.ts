import { ButtonInteraction, MessageButton, TextChannel } from "discord.js";
import { Language } from "types";
import { Templates } from ".";

export default {
    messages: {
        edit: {
            addActions: (language: Language, vars: any) => {
                if(!vars?.message?.url || !vars?.message?.id || !vars?.message?.channel?.id) return []

                const jumpToMessageButton = new MessageButton()
                    .setURL(vars.message.url)
                    .setStyle('LINK')
                    .setLabel(t('logs.general.jumpToMessage', language));

                const deleteMessage = new MessageButton()
                    .setStyle('DANGER')
                    .setCustomId(`logs-messages-edit-deleteMessage-${vars.message.channel.id}-${vars.message.id}`)
                    .setLabel(t('logs.messages.edit.deleteMessage', language))

                return [jumpToMessageButton, deleteMessage]
            },
            handleActions: async (interaction: ButtonInteraction) => {
                const customId = interaction.customId.split('-')
                const messageId = customId.pop()
                const channelId = customId[customId.length-1]
                if(!messageId || !channelId) return
                
                const channel = await interaction.guild?.channels.fetch(channelId).catch(console.warn)
                if(!channel) return
                const message = await (channel as TextChannel).messages.fetch(messageId).catch(console.warn)
                if(!message) return

                const res = await message.delete().catch(console.warn)
                if(!res) return

                return interaction.update({
                    components: []
                }).catch(console.error)
            }
        },
        pin: {
            addActions: (language: Language, vars: any) => {
                if(!vars?.message?.url) return []

                const jumpToMessageButton = new MessageButton()
                    .setURL(vars.message.url)
                    .setStyle('LINK')
                    .setLabel(t('logs.general.jumpToMessage', language));

                return [jumpToMessageButton]
            },
            handleActions: (interaction: ButtonInteraction) => {

            }
        },
        unpin: {
            addActions: (language: Language, vars: any) => {
                if(!vars?.message?.url) return []

                const jumpToMessageButton = new MessageButton()
                    .setURL(vars.message.url)
                    .setStyle('LINK')
                    .setLabel(t('logs.general.jumpToMessage', language));

                return [jumpToMessageButton]
            },
            handleActions: (interaction: ButtonInteraction) => {

            }
        }
    },
    members: {},
    roles: {},
    channels: {},
    threads: {}
} as {
    [category in keyof Templates]: {
        [type: string]: {
            addActions?: (language: Language, vars: any) => MessageButton[],
            handleActions?: (interaction: ButtonInteraction) => void
        }
    }
}