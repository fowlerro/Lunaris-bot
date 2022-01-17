import { CommandInteraction, MessageEmbed } from "discord.js";

import { WelcomeMessageDocument } from "../../../database/schemas/WelcomeMessage";
import WelcomeMessage from "../../../modules/WelcomeMessage";
import Embeds from "../../../modules/Embeds";
import Guilds from "../../../modules/Guilds";

import { translate } from "../../../utils/languages/languages";
import { palette } from "../../../utils/utils";

import { Language } from "types";

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

function handleError(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(translate(language, 'cmd.welcome.error'));

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
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
    const channel = welcomeConfig.channelId && await interaction.guild?.channels.fetch(welcomeConfig.channelId)
    const list = await WelcomeMessage.list(interaction.guildId!)

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setTitle(translate(language, 'cmd.welcome.info.title'))
        .addField('Status', translate(language, welcomeConfig.status ? 'general.on' : 'general.off'))
        .addField(translate(language, 'general.channel'), channel?.toString() || translate(language, 'general.none'))
        .addField(translate(language, 'cmd.welcome.info.list'), list?.map((item, index) => `${index+1}. ${item}`).join('\n') || translate(language, 'general.none'))

    const checkedEmbed = await Embeds.checkLimits(embed, false)
    if(checkedEmbed.error || !checkedEmbed.pages[0]) return handleError(interaction, language)
    
    return interaction.reply({
        embeds: [checkedEmbed.pages[0]]
    })
}