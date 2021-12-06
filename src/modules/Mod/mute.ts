import { Guild, Permissions, Role } from "discord.js";
import { Snowflake } from "discord-api-types";

import Guilds from "../Guilds";
import { GuildMemberModel } from "../../database/schemas/GuildMembers";
import { translate } from "../../utils/languages/languages";

// TODO: Remove mute if someone take role from a member
export const Mute = {
    add: async (guildId: Snowflake, userId: Snowflake, reason?: string, by?: Snowflake, time?: number) => {
            const guild = await client.guilds.fetch(guildId).catch(() => {})
            if(!guild) return
            if(!guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.MANAGE_ROLES]).toArray() }

            let timestamp = 0;
            const date = Date.now();
            if(time) timestamp = date + time;

            const muteRole = await Mute.getRole(guild)
            const member = await guild.members.fetch(userId).catch(() => {})
            if(!member) return 
            await member.roles.add(muteRole).catch(e => console.log(e))
            await GuildMemberModel.findOneAndUpdate({ guildId, userId }, {
                muted: {
                    isMuted: true,
                    timestamp,
                    date,
                    reason,
                    by
                }
            }, { upsert: true })

            if(time) {
                setTimeout(async () => {
                    const member = await guild.members.fetch(userId).catch(() => {})
                    if(member) await member.roles.remove(muteRole).catch(e => console.log(e));
                    const muteInfo = await GuildMemberModel.findOneAndUpdate({ guildId, userId }, {
                        muted: {
                            isMuted: false,
                            timestamp: null,
                            date: null,
                            reason: null,
                            by: null,
                        }
                    }, { upsert: true });

                    // unmuteLog(client, guildId, muteInfo.muted.by, 'System', userId); // TODO
                }, time);
            }

            // const timeString = time ? msToTime(time).toString() : "perm";
            // muteLog(client, guildId, by, userId, reason, timeString); // TODO
            
            return true;
    },
    remove: async (guildId: Snowflake, executorId: Snowflake, userId: Snowflake, reason?: string) => {
        const guild = await client.guilds.fetch(guildId).catch(e => {})
        if(!guild) return
        const member = await guild.members.fetch(userId).catch(e => {})
        if(!member) return

        if(!guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.MANAGE_ROLES]).toArray() }

        const muteRole = await Mute.getRole(guild)
        const hasRole = member.roles.cache.has(muteRole.id);
        if(!hasRole && reason !== "Role remove") return "notMuted";

        hasRole && await member.roles.remove(muteRole).catch(e => console.log(e));
        const muteInfo = await GuildMemberModel.findOneAndUpdate({ guildId, userId }, {
            muted: {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null,
            }
        }, { upsert: true });

        // unmuteLog(client, guildId, muteInfo.muted.by, executorId, userId, reason); // TODO

        return true;
    },
    removeAll: async (guildId: Snowflake) => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return

        if(!guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: 'missingPermission', perms: Permissions.FLAGS.MANAGE_ROLES }

        const guildConfig = await Guilds.config.get(guildId);
        const language = guildConfig.language


        const muteRole = await Mute.getRole(guild)

        // TODO: Fetch SOMEHOW all members with specific role
        // console.log('muteRole', muteRole.members.fetch());
        // console.log('users', client.users);

        // await muteRole.members.forEach(async member => { 
        //     console.log('unmute', member.id);
        //     member.roles.remove(muteRole, translate(language, 'autoMod.mute.removeAllMutesReason'));
        // })

        const guildMutes = await GuildMemberModel.updateMany({ guildId, 'mute.isMuted': true }, {
            muted: {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null,
            }
        });

        return { results: guildMutes }
    },
    list: async (guildId: Snowflake) => {
        const { language } = await Guilds.config.get(guildId);
        const guildMembers = await GuildMemberModel.find({ guildId, 'mute.isMuted': true }).select(['-warns', '-_id', '-guildId', '-__v']);
        if(!guildMembers.length) return { error: translate(language, 'general.none') };
        return guildMembers;
    },
    reassignRole: async (guildId: Snowflake, userId: Snowflake) => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return
        const member = await guild.members.fetch(userId).catch(() => {})
        if(!member) return

        const muteRole = await Mute.getRole(guild)
        const guildMembers = await GuildMemberModel.findOne({ guildId, userId, 'mute.isMuted': true });
        if(!guildMembers) return 'notMuted';
        await member.roles.add(muteRole).catch(e => console.log(e));

        return true;
    },
    getRole: async (guild: Guild): Promise<Role> => {
        const guildConfig = await Guilds.config.get(guild.id)
        
        const muteRoleId = guildConfig.modules?.autoMod?.muteRole
        
        let muteRole = muteRoleId ? await guild.roles.fetch(muteRoleId) : guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        if(!muteRole) muteRole = await createMuteRole(guild);

        if(muteRoleId !== muteRole.id) Guilds.config.set(guild.id, { 'modules.autoMod.muteRole': muteRole.id });
        
        return muteRole
    }
}

async function createMuteRole(guild: Guild) {
    const muteRole = await guild.roles.create({
        name: 'Muted',
        permissions: []
    });
    await (await guild.channels.fetch()).map(async channel => {
        await channel.permissionOverwrites.create(muteRole, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            ADD_REACTIONS: false,
        })
    });

    return muteRole;
}