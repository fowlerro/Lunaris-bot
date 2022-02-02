import { GuildMember, Permissions } from "discord.js";

export const Mute = {
    add: async (member: GuildMember, executor: GuildMember, time: number, reason?: string) => {
        if(!executor.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return { error: 'executorWithoutPermission' }
        if(!member.moderatable || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return { error: 'notModeratable' }
        if(member.isCommunicationDisabled()) return { error: 'alreadyTimedOut' }
        member.timeout(time, reason)
    },
    remove: async (member: GuildMember, executor: GuildMember, reason?: string) => {
        if(!executor.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return { error: 'executorWithoutPermission' }
        if(!member.moderatable || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return { error: 'notModeratable' }

        if(!member.isCommunicationDisabled()) return { error: 'notTimedOut' }
        member.timeout(null, reason)
    }, 
}