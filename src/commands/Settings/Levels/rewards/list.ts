import { CommandInteraction, MessageEmbed } from "discord.js";

import Embeds from "../../../../modules/Embeds";
import Levels from "../../../../modules/Levels";
import { getLocale, palette } from "../../../../utils/utils";

import { LevelReward, LevelRewards } from "types";

export default async (interaction: CommandInteraction) => {
    const scope = interaction.options.getString('scope') || undefined
   
    const rewardList = await Levels.rewardList(interaction.guildId!, typeof scope === 'string' ? (scope === 'voice' ? 'voice' : 'text') : undefined)
    if(!rewardList) return handleError(interaction)

    if(Array.isArray(rewardList)) return scopedList(interaction, rewardList, scope === 'voice' ? 'voice' : 'text')
    return fullList(interaction, rewardList)
}

async function scopedList(interaction: CommandInteraction, rewardList: LevelReward[], scope: 'text' | 'voice') {
    const language = getLocale(interaction.guildLocale)
    const description = rewardList.map(reward => `**Level**: \`${reward.level}\`, **${t('general.role', language)}**: ${reward.roleId ? `<@&${reward.roleId}>` : t('general.none', language)}, **${t('command.level.rewards.takePreviousRole', language)}**: ${reward.takePreviousRole ? t('general.yes', language) : t('general.no', language)}`)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setTitle(t(`command.level.rewards.${scope}ListTitle`, language))
        .setDescription(description.length ? description.join('\n') : t('general.none', language))

    const checkedEmbed = await Embeds.checkLimits(embed, false)
    if(checkedEmbed.error) return handleError(interaction)

    return interaction.reply({
        embeds: [embed]
    })
}

async function fullList(interaction: CommandInteraction, rewardList: LevelRewards) {
    const language = getLocale(interaction.guildLocale)
    const textField = rewardList.text.map(reward => `**Level**: \`${reward.level}\`, **${t('general.role', language)}**: ${reward.roleId ? `<@&${reward.roleId}>` : t('general.none', language)}, **${t('command.level.rewards.takePreviousRole', language)}**: ${reward.takePreviousRole ? t('general.yes', language) : t('general.no', language)}`)
    const voiceField = rewardList.voice.map(reward => `**Level**: \`${reward.level}\`, **${t('general.role', language)}**: ${reward.roleId ? `<@&${reward.roleId}>` : t('general.none', language)}, **${t('command.level.rewards.takePreviousRole', language)}**: ${reward.takePreviousRole ? t('general.yes', language) : t('general.no', language)}`)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setTitle(t('command.level.rewards.listTitle', language))
        .addField(t('command.level.rewards.text', language), textField.length ? textField.join('\n') : t('general.none', language))
        .addField(t('command.level.rewards.voice', language), voiceField.length ? voiceField.join('\n') : t('general.none', language))

    const checkedEmbed = await Embeds.checkLimits(embed, false)
    if(checkedEmbed.error) return handleError(interaction)

    return interaction.reply({
        embeds: [embed]
    })
}

function handleError(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('general.error', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}