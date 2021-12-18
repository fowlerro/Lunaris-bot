import { Guild, Permissions } from "discord.js"
import { Snowflake } from "discord-api-types"

import { GuildBanModel } from "../../database/schemas/GuildBans"

export const Ban = {
    add: async (targetId: Snowflake, guildId: Snowflake, executorId: Snowflake, reason?: string, time?: number) => {
        if(!targetId) return { error: "Missing targetId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {})
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const target = await guild.members.fetch(targetId).catch(() => {}) || await client.users.fetch(targetId).catch(() => {})
        if(!target) return { error: "Wrong targetId" }
        if('bannable' in target && !target.bannable) return { error: 'targetNotManagable' }

        let timestamp: number = 0;
        const date = Date.now();
        if(time) timestamp = date + time;
        if(!timestamp) return { error: null, result: guild.bans.create(targetId, { reason }) }
        const result = await saveBan(targetId, guild, executorId, reason, time, timestamp)
        if(!result) return { error: "Something went wrong" }

        return { result }
    },
    remove: async (targetId: Snowflake, guildId: Snowflake, by: Snowflake, reason?: string) => {
        if(!targetId) return { error: "Missing targetId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {});
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const target = await guild.members.fetch(targetId).catch(() => {}) || await client.users.fetch(targetId).catch(() => {})
        if(!target) return { error: "Wrong targetId" }
        
        const result = await guild.bans.remove(targetId, reason).catch(e => {})
        if(!result) return { error: "notBanned" }

        return { result };
    }
}

async function saveBan(userId: Snowflake, guild: Guild, by: Snowflake, reason?: string, time?: number, timestamp?: number) {

    const result = await guild.bans.create(userId, { reason }).catch(e => {})
    if(!result) return;

    await GuildBanModel.create({
        userId,
        guildId: guild.id,
        by,
        reason,
        time: timestamp
    });

    setTimeout(async () => {
        await guild.bans.remove(userId, `Timed ban ended, reason: ${reason || 'none'}`).catch(e => {})
        await GuildBanModel.findOneAndDelete({ userId, guildId: guild.id });
    }, time);

    return true;
}

export async function registerBans() {
    const bans = await GuildBanModel.find();
    for(const ban of bans) {
        const guild = await client.guilds.fetch(ban.guildId).catch(() => {})
        if(!guild) return
        const user = await client.users.fetch(ban.userId).catch(() => {})
        if(!user) return
        if(ban.time && ban.time < Date.now()) {
            await guild.bans.remove(user.id, `Timed ban ended, reason: ${ban.reason || 'none'}`).catch(e => {})

            ban.remove();
        }
        setTimeout(async () => {
            await guild.bans.remove(user.id, `Timed ban ended, reason: ${ban.reason || 'none'}`).catch(e => {})

            ban.remove();
        }, (ban.time || 0) - Date.now());
    }
}