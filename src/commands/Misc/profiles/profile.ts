import { CommandInteraction } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";
import Profiles from "../../../modules/Profiles";
import { GuildProfile } from "../../../database/schemas/GuildProfile";
import { Profile } from "../../../database/schemas/Profile";

export default class LanguageCommand extends BaseCommand {
    constructor() {
        super(
            'profile',
            'CHAT_INPUT',
            {
                en: "Displays user's profile",
                pl: 'Wyświetla profil użytkownika'
            },
            [
                {
                    name: 'user',
                    description: "Displays specified user's profile",
                    type: 'USER',
                },
                {
                    name: 'global',
                    description: "Mark to display global profile insted of server profile",
                    type: 'BOOLEAN',
                },
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId) return

        const member = interaction.options.getMember('user') || interaction.member
        if(!member || !('id' in member) || member.user.bot) return
        const isGlobal = interaction.options.getBoolean('global') || false

        const profile = await Profiles.get(member.id, interaction.guildId) as GuildProfile;
        if(!profile) return;
        const globalProfile = await Profiles.get(member.id) as Profile;
        if(!globalProfile) return;

        const profileCardBuffer = await Profiles.generateCard(member, profile, globalProfile, member.user.displayAvatarURL({ format: 'png' }), isGlobal);

        interaction.reply({
            files: [profileCardBuffer]
        })
    }
}