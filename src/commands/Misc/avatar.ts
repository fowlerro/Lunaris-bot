import { ContextMenuInteraction, MessageEmbed } from "discord.js"

import BaseCommand from "../../utils/structures/BaseCommand"

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super(
            'Avatar',
            'USER',
            {
                en: "Displays user's avatar",
                pl: "Wyświetla avatar użytkownika"
            },
        )
    }

    async run(interaction: ContextMenuInteraction) {
        const targetMember = await interaction.guild?.members.fetch(interaction.targetId).catch(console.error)
        if(!targetMember) return
        const avatarURL = targetMember.user.displayAvatarURL({ size: 256, dynamic: true })

        const embed = new MessageEmbed()
            .setColor(targetMember.displayColor)
            .setImage(avatarURL)

        interaction.reply({
            embeds: [embed]
        })
    }
}