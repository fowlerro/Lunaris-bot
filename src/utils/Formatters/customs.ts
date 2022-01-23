import { Formatters, GuildMember } from "discord.js";

export function dateNow() {
    return Formatters.time(new Date())
}

export function memberAvatar(member: GuildMember) {
    return member.displayAvatarURL()
}

export function serverIcon(member: GuildMember) {
    return member.guild.iconURL()
}