import { CommandInteraction, MessageEmbed } from "discord.js";

import Guilds from "../../../modules/Guilds";
import WelcomeMessage from "../../../modules/WelcomeMessage";
import { translate } from "../../../utils/languages/languages";
import { Language } from "types";
import { palette } from "../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    const { language } = await Guilds.config.get(interaction.guildId!)

    const messageList = await WelcomeMessage.list(interaction.guildId!)
    const description = messageList ? formatWelcomeMessageList(messageList, language) : translate(language, "cmd.welcome.error")

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setDescription(description);

    return interaction.reply({
        embeds: [embed]
    })
}

export function formatWelcomeMessageList(list: string[], language: Language) {
    if(!list.length) return translate(language, "cmd.welcome.listEmpty")

    return list.reduce((prev, curr, index) => prev + `${index+1}. ${curr}\n`, "")
}