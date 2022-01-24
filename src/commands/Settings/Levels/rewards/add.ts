import { CommandInteraction, MessageEmbed } from "discord.js";
import xpSystem from "../../../../modules/xpSystem";
import { palette } from "../../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'

    const role = interaction.options.getRole('role', true)
    const level = interaction.options.getInteger('level', true)
    const scope = interaction.options.getString('scope', true)
    const removePreviousReward = interaction.options.getBoolean('remove-previous-reward') || false

    const res = await xpSystem.addReward(
        interaction.guildId!,
        { roleId: role.id, level, takePreviousRole: removePreviousReward },
        scope === 'voice' ? 'voice' : 'text'
    )
    if(!res) return handleError(interaction)
    if('error' in res && res.error === 'rewardsLimit') return limitRewards(interaction)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.level.rewards.add', language))

    return interaction.reply({
        embeds: [embed]
    })
}

function limitRewards(interaction: CommandInteraction) {
    const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.level.rewards.limitError', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

function handleError(interaction: CommandInteraction) {
    const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('general.error', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}