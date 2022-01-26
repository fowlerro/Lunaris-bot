import { Formatters, GuildMember } from "discord.js";

export function dateNow(member: GuildMember, formatDate: boolean) {
    return formatDate ? Formatters.time(new Date()) : new Date().toUTCString()
}

export function memberAvatar(member: GuildMember) {
    return member.displayAvatarURL()
}

export function serverIcon(member: GuildMember) {
    return member.guild.iconURL()
}