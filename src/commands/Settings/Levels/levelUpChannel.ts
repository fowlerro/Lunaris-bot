import { CommandInteraction, MessageEmbed } from "discord.js";
import Levels from "../../../modules/Levels";
import { getLocale, palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const mode = interaction.options.getString('mode')
    const channel = interaction.options.getChannel('channel')

    const language = getLocale(interaction.guildLocale)

    if(!mode) return displayChannel(interaction)
    if(mode !== 'off' && mode !== 'currentChannel' && mode !== 'specificChannel') return wrongMode(interaction)
    if(mode === 'specificChannel' && !channel) return notSpecifiedChannel(interaction)

    const res = await Levels.setLevelUpChannel(interaction.guildId!, mode, channel?.id)
    if(!res) return handleError(interaction)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(`command.level.levelUpChannel.set.${mode}`, language))

    return interaction.reply({
        embeds: [embed]
    })
}

async function displayChannel(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)

    const config = await Levels.get(interaction.guildId!)
    if(!config) return handleError(interaction)
    const { mode, channelId } = config.levelUpMessage

    const description = mode === 'currentChannel' ? t('command.level.levelUpChannel.currentChannel', language)
        : mode === 'specificChannel' && channelId ? t('command.level.levelUpChannel.specificChannel', language, { channel: `<#${channelId}>` })
        : t('command.level.levelUpChannel.disabled', language)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(description)

    return interaction.reply({
        embeds: [embed]
    })
}

async function wrongMode(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.level.levelUpChannel.wrongMode', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}
async function notSpecifiedChannel(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.level.levelUpChannel.notSpecifiedChannel', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

async function handleError(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('general.error', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}