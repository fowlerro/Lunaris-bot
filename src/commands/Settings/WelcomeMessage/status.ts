import { CommandInteraction, MessageEmbed } from "discord.js";

import WelcomeMessage from "../../../modules/WelcomeMessage";
import Embeds from "../../../modules/Embeds";
import { WelcomeMessageModel } from "../../../database/schemas/WelcomeMessage";
import { getLocale, palette } from "../../../utils/utils";
import { handleError } from './index'
import type { Language, WelcomeMessage as WelcomeMessageType } from "types";

import { formatWelcomeMessageList } from "./list";


export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)
    const status = interaction.options.getBoolean('enable')
    const welcomeConfig = await WelcomeMessage.get(interaction.guildId!)

    if(!welcomeConfig) return handleError(interaction, language)

    if(typeof status === 'boolean') {
        if(welcomeConfig.status === status) return alreadySet(interaction, language, status)
        welcomeConfig.status = status
        const saved = await WelcomeMessageModel.findOneAndUpdate({ guildId: interaction.guildId }, { 
            status
        }, { new: true, upsert: true, runValidators: true }).catch(() => {})
        if(!saved) return handleError(interaction, language)
        await WelcomeMessage.setCache(saved)
        return set(interaction, language, status)
    }

    return displayStatus(interaction, language, welcomeConfig)
}

function alreadySet(interaction: CommandInteraction, language: Language, status: boolean) {
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(t(`command.welcome.status.already${status ? 'Enabled' : 'Disabled'}`, language));
    
    return interaction.reply({
        embeds: [embed]
    })
}

function set(interaction: CommandInteraction, language: Language, status: boolean) {
    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t(`command.welcome.status.${status ? 'enabled' : 'disabled'}`, language));

    return interaction.reply({
        embeds: [embed]
    })
}

async function displayStatus(interaction: CommandInteraction, language: Language, welcomeConfig: WelcomeMessageType) {
    const channelJoin = welcomeConfig.channels.join && await interaction.guild?.channels.fetch(welcomeConfig.channels.join).catch(() => {})
    const channelLeave = welcomeConfig.channels.leave && await interaction.guild?.channels.fetch(welcomeConfig.channels.leave).catch(() => {})
    const list = await WelcomeMessage.list(interaction.guildId!)
    if(!list) return handleError(interaction, language)
    const formattedList = formatWelcomeMessageList(list, language)
    if(typeof formattedList === 'string') return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setTitle(t('command.welcome.info.title', language))
        .addField('Status', t(welcomeConfig.status ? 'general.on' : 'general.off', language))
        .addField(t('command.welcome.info.joinChannel', language), channelJoin?.toString() || t('general.off', language))
        .addField(t('command.welcome.info.leaveChannel', language), channelLeave?.toString() || t('general.off', language))
        .addField(t('command.welcome.list.join', language), formattedList.join)
        .addField(t('command.welcome.list.leave', language), formattedList.leave)

    const checkedEmbed = await Embeds.checkLimits(embed, false)
    if(checkedEmbed.error || !checkedEmbed.pages[0]) return handleError(interaction, language)
    
    return interaction.reply({
        embeds: [checkedEmbed.pages[0]]
    })
}