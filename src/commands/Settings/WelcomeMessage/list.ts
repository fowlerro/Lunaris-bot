import { CommandInteraction, MessageEmbed } from "discord.js";

import Embeds from "../../../modules/Embeds";
import WelcomeMessage from "../../../modules/WelcomeMessage";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";
import type { GroupedWelcomeMessageFormats, Language, WelcomeMessageAction, WelcomeMessageFormat } from "types";


export default async (interaction: CommandInteraction) => {
    const language = getLocale(interaction.guildLocale)

    const action = interaction.options.getString('action') as WelcomeMessageAction | null
    if(action) return selectedAction(interaction, language, action)

    const messageList = await WelcomeMessage.list(interaction.guildId!)
    if(!messageList) return handleCommandError(interaction, 'general.error')
    
    const formattedList = formatWelcomeMessageList(messageList, language)
    if(typeof formattedList === 'string') return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .addField(t('command.welcome.list.join', language), formattedList.join)
        .addField(t('command.welcome.list.leave', language), formattedList.leave)

    return interaction.reply({
        embeds: [embed]
    }).catch(logger.error)
}

async function selectedAction(interaction: CommandInteraction, language: Language, action: WelcomeMessageAction) {
    const messageList = await WelcomeMessage.list(interaction.guildId!, action)
    if(!messageList) return handleCommandError(interaction, 'general.error')
    
    const formattedList = formatWelcomeMessageList(messageList, language) as string

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .addField(t(`command.welcome.list.${action}`, language), formattedList)

    const checkedEmbed = await Embeds.checkLimits(embed, false)
    if(checkedEmbed.error || !checkedEmbed.pages[0]) return handleCommandError(interaction, 'general.error')

    return interaction.reply({
        embeds: [checkedEmbed.pages[0]]
    }).catch(logger.error)
}


export function formatWelcomeMessageList(list: WelcomeMessageFormat[] | GroupedWelcomeMessageFormats, language: Language) {
    if(Array.isArray(list)) {
        if(!list.length) return t("command.welcome.listEmpty", language)
    
        return list.reduce((prev, curr, index) => prev + `${index+1}. ${curr.message}\n`, "")
    }

    return {
        join: list.join?.length ? list.join.reduce((prev, curr, index) => prev + `${index+1}. ${curr.message}\n`, "") : t('command.welcome.listEmpty', language),
        leave: list.leave?.length ? list.leave.reduce((prev, curr, index) => prev + `${index+1}. ${curr.message}\n`, "") : t('command.welcome.listEmpty', language),
    }
}