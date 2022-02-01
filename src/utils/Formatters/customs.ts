import { Formatters, GuildMember } from "discord.js";

export function dateNow(member: GuildMember, dateStyle: typeof Formatters.TimestampStylesString = 'f') {
    return Formatters.time(new Date(), dateStyle)
}

export function memberAvatar(member: GuildMember) {
    return member.displayAvatarURL()
}

export function serverIcon(member: GuildMember) {
    return member.guild.iconURL()
}