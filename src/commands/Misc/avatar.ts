import { CommandInteraction, ContextMenuInteraction } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super(
            'Avatar',
            'USER',
            {
                en: "Displays user's avatar",
                pl: "Wyświetla avatar użytkownika"
            },
        );
    }

    async run(interaction: ContextMenuInteraction) {
        const targetMember = await interaction.guild?.members.fetch(interaction.targetId).catch(() => {})
        if(!targetMember) return;
        const avatarURL = targetMember.user.avatarURL();
        if(!avatarURL) return;

        interaction.reply({
            content: avatarURL,
        })
    }
}