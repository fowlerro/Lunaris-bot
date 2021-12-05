import { Message } from "discord.js";
import { GuildMember } from "../../../database/schemas/GuildMembers";
import { Profile } from "../../../database/schemas/Profile";
import Profiles from "../../../modules/Profiles";
import DiscordClient from "../../../types/client";

const { resetDailyXp } = require("../../../modules/xpSystem/utils");

module.exports = {
    name: 'profile',
    aliases: ['profil', 'prof'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 2,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla profil użytkownika",
        en: "Displays user's profile",
    },
    category: 'profiles',
    syntax: {
        pl: 'profile [<user>]',
        en: 'profile [<user>]',
    },
    permissions: [],
    allowedChannels: [],
    blockedChannels: [],
    allowedRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: true,
    async run(client: DiscordClient, message: Message, args: any) {
        if(!message.guild) return
        const member = !isNaN(args[0]) ? await message.guild.members.fetch(args[0]) : message.mentions.members?.first() || (await message.guild.members.fetch(message.author.id));
        if(!member) return
        const isGlobal = args.includes('global');

        const profile = await Profiles.get(member.id, message.guild.id);
        if(!profile) return;
        const globalProfile: Profile = await Profiles.get(member.id);
        if(!globalProfile) return;

        const profileCardBuffer = await Profiles.generateCard(member, profile, globalProfile, member.user.displayAvatarURL({ format: 'png' }), isGlobal);
        return message.channel.send({ files: [profileCardBuffer] });
    }
}