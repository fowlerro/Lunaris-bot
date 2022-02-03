import { CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../modules/Levels";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";

export default async (interaction: CommandInteraction) => {
    const mode = interaction.options.getString('mode')
    const channel = interaction.options.getChannel('channel')

    const language = getLocale(interaction.guildLocale)

    if(!mode) return displayChannel(interaction)
    if(mode !== 'off' && mode !== 'currentChannel' && mode !== 'specificChannel') return handleCommandError(interaction, 'command.level.levelUpChannel.wrongMode')
    if(mode === 'specificChannel' && !channel) return handleCommandError(interaction, 'command.level.levelUpChannel.notSpecifiedChannel')

    const res = await Levels.setLevelUpChannel(interaction.guildId!, mode, channel?.id)
    if(!res) return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(`command.level.levelUpChannel.set.${mode}`, language))

    return interaction.reply({
        embeds: [embed]
    }).catch(console.error)
}

async function displayChannel(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)

    const config = await Levels.get(interaction.guildId!)
    if(!config) return handleCommandError(interaction, 'general.error')
    const { mode, channelId } = config.levelUpMessage

    const description = mode === 'currentChannel' ? t('command.level.levelUpChannel.currentChannel', language)
        : mode === 'specificChannel' && channelId ? t('command.level.levelUpChannel.specificChannel', language, { channel: `<#${channelId}>` })
        : t('command.level.levelUpChannel.disabled', language)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(description)

    return interaction.reply({
        embeds: [embed]
    }).catch(console.error)
}