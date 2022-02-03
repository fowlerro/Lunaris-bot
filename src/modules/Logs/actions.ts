import { ButtonInteraction, MessageButton, TextChannel } from "discord.js";

import type { Templates } from "./index";
import type { Language } from "types";

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
                
                const channel = await interaction.guild?.channels.fetch(channelId).catch(logger.error)
                if(!channel) return
                const message = await (channel as TextChannel).messages.fetch(messageId).catch(logger.error)
                if(!message) return

                const res = await message.delete().catch(logger.error)
                if(!res) return

                return interaction.update({
                    components: []
                }).catch(logger.error)
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
    threads: {},
    invites: {},
    emojis: {},
    server: {}
} as Actions<Templates>

type Actions<T> = {
    [category in keyof T]: {
        [type in keyof T[category]]?: {
            addActions: (language: Language, vars: any) => MessageButton[]
            handleActions: (interaction: ButtonInteraction) => void
        }
    }
}