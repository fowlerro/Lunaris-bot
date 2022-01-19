import { CommandInteraction, MessageEmbed } from "discord.js";

import { WelcomeMessageDocument } from "../../../database/schemas/WelcomeMessage";
import WelcomeMessage from "../../../modules/WelcomeMessage";
import Embeds from "../../../modules/Embeds";
import Guilds from "../../../modules/Guilds";
import { handleError } from './index'

import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

import { Language } from "types";
import { formatWelcomeMessageList } from "./list";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)
    const status = interaction.options.getBoolean('enable')
    const welcomeConfig = await WelcomeMessage.get(interaction.guildId!)

    if(!welcomeConfig) return handleError(interaction, language)

    if(typeof status === 'boolean') {
        if(welcomeConfig.status === status) return alreadySet(interaction, language, status)
        
        welcomeConfig.status = status
        const saved = welcomeConfig.save().catch(() => {})
        if(!saved) return handleError(interaction, language)
        return set(interaction, language, status)
    }

    return displayStatus(interaction, language, welcomeConfig)
}

function alreadySet(interaction: CommandInteraction, language: Language, status: boolean) {
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(translate(language, `cmd.welcome.status.already${status ? 'Enabled' : 'Disabled'}`));
    
    return interaction.reply({
        embeds: [embed]
    })
}

function set(interaction: CommandInteraction, language: Language, status: boolean) {
    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(translate(language, `cmd.welcome.status.${status ? 'enabled' : 'disabled'}`));

    return interaction.reply({
        embeds: [embed]
    })
}

async function displayStatus(interaction: CommandInteraction, language: Language, welcomeConfig: WelcomeMessageDocument) {
    const channelJoin = welcomeConfig.channels.join && await interaction.guild?.channels.fetch(welcomeConfig.channels.join).catch(() => {})
    const channelLeave = welcomeConfig.channels.leave && await interaction.guild?.channels.fetch(welcomeConfig.channels.leave).catch(() => {})
    const list = await WelcomeMessage.list(interaction.guildId!)
    if(!list) return handleError(interaction, language)
    const formattedList = formatWelcomeMessageList(list, language)
    if(typeof formattedList === 'string') return handleError(interaction, language)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setTitle(translate(language, 'cmd.welcome.info.title'))
        .addField('Status', translate(language, welcomeConfig.status ? 'general.on' : 'general.off'))
        .addField(translate(language, 'cmd.welcome.info.joinChannel'), channelJoin?.toString() || translate(language, 'general.off'))
        .addField(translate(language, 'cmd.welcome.info.leaveChannel'), channelLeave?.toString() || translate(language, 'general.off'))
        .addField(translate(language, 'cmd.welcome.list.join'), formattedList.join)
        .addField(translate(language, 'cmd.welcome.list.leave'), formattedList.leave)

    const checkedEmbed = await Embeds.checkLimits(embed, false)
    if(checkedEmbed.error || !checkedEmbed.pages[0]) return handleError(interaction, language)
    
    return interaction.reply({
        embeds: [checkedEmbed.pages[0]]
    })
}