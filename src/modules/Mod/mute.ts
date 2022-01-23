import { Guild, Permissions, Role, Snowflake } from "discord.js";

import Guilds from "../Guilds";
import { GuildProfileModel } from "../../database/schemas/GuildProfile";
import Profiles from "../Profiles";

// TODO: Remove mute if someone take role from a member
export const Mute = {
    add: async (guildId: Snowflake, targetId: Snowflake, reason?: string, executorId?: Snowflake, time?: number) => {
            const guild = await client.guilds.fetch(guildId).catch(() => {})
            if(!guild) return { error: 'missingGuild' }
            if(!guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.MANAGE_ROLES]).toArray() }

            let timestamp = 0;
            const date = Date.now();
            if(time) timestamp = date + time;

            const muteRole = await Mute.getRole(guild)
            if(!muteRole) return { error: 'error' }
            const targetMember = await guild.members.fetch(targetId).catch(() => {})
            if(!targetMember) return { error: 'missingTarget' }
            if(!targetMember.manageable) return { error: 'targetNotManagable' }
            await targetMember.roles.add(muteRole).catch(e => console.log(e))
            const document = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
                mute: {
                    isMuted: true,
                    timestamp,
                    date,
                    reason,
                    executorId
                }
            }, { upsert: true, new: true, runValidators: true }).catch(() => {})
            if(!document) return { error: 'error' }

            await Profiles.set(document)

            if(time) {
                setTimeout(async () => {
                    const member = await guild.members.fetch(targetId).catch(() => {})
                    if(member) await member.roles.remove(muteRole).catch(e => console.log(e));
                    const muteInfo = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
                        mute: {
                            isMuted: false,
                            timestamp: null,
                            date: null,
                            reason: null,
                            executorId: null,
                        }
                    }, { upsert: true, new: true, runValidators: true }).catch(() => {})
                    if(!muteInfo) return { error: 'error' }
                    await Profiles.set(muteInfo)
                }, time);
            }
            
            return { error: null };
    },
    remove: async (guildId: Snowflake, executorId: Snowflake, targetId: Snowflake, reason?: string) => {
        const guild = await client.guilds.fetch(guildId).catch(e => {})
        if(!guild) return { error: 'missingGuild' }
        const targetMember = await guild.members.fetch(targetId).catch(e => {})
        if(!targetMember) return { error: 'missingTarget' }

        if(!targetMember.manageable) return { error: 'targetNotManagable' }
        if(!guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.MANAGE_ROLES]).toArray() }

        const muteRole = await Mute.getRole(guild)
        if(!muteRole) return { error: 'error' }
        const hasRole = targetMember.roles.cache.has(muteRole.id);
        if(!hasRole && reason !== "Role remove") return { error: "notMuted" };

        hasRole && await targetMember.roles.remove(muteRole).catch(e => console.log(e));
        const muteInfo = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
            mute: {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                executorId: null,
            }
        }, { upsert: true, new: true, runValidators: true }).catch(() => {})
        if(!muteInfo) return { error: 'error' }
        await Profiles.set(muteInfo)

        return { error: null };
    }, 
    list: async (guildId: Snowflake) => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return { error: t('autoMod.mute.error', 'en') }
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'
        const guildMembers = await GuildProfileModel.find({ guildId, 'mute.isMuted': true }).select(['-warns', '-_id', '-guildId', '-__v']);
        if(!guildMembers.length) return { error: t('general.none', language) };
        return { mutedMembers: guildMembers, error: null };
    },
    reassignRole: async (guildId: Snowflake, userId: Snowflake) => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return
        const member = await guild.members.fetch(userId).catch(() => {})
        if(!member) return

        const muteRole = await Mute.getRole(guild)
        if(!muteRole) return
        const guildMembers = await GuildProfileModel.findOne({ guildId, userId, 'mute.isMuted': true });
        if(!guildMembers) return 'notMuted';
        await member.roles.add(muteRole).catch(e => console.log(e));

        return true;
    },
    getRole: async (guild: Guild): Promise<Role | undefined> => {
        const guildConfig = await Guilds.config.get(guild.id)
        if(!guildConfig) return
        const muteRoleId = guildConfig.muteRole
        
        let muteRole = muteRoleId ? await guild.roles.fetch(muteRoleId) : guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        if(!muteRole) muteRole = await createMuteRole(guild);

        if(muteRoleId !== muteRole.id) Guilds.config.set(guild.id, { muteRole: muteRole.id });
        
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