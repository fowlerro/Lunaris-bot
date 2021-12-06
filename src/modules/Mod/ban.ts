import { Guild, Permissions } from "discord.js"
import { Snowflake } from "discord-api-types"

import { GuildBanModel } from "../../database/schemas/GuildBans"

export const Ban = {
    add: async (userId: Snowflake, guildId: Snowflake, by: Snowflake, reason?: string, time?: number) => {
        if(!userId) return { error: "Missing userId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {})
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const user = await client.users.fetch(userId).catch(e => {})
        if(!user) return { error: "Wrong userId" }

        let timestamp: number = 0;
        const date = Date.now();
        if(time) timestamp = date + time;
        if(!timestamp) return guild.bans.create(userId, { reason });
        const result = await saveBan(userId, guild, by, reason, time, timestamp)
        if(!result) return { error: "Something went wrong" }

        return { result }
    },
    remove: async (userId: Snowflake, guildId: Snowflake, by: Snowflake, reason?: string) => {
        if(!userId) return { error: "Missing userId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {});
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const user = await client.users.fetch(userId).catch(e => {})
        if(!user) return { error: "Wrong userId" }

        const result = await guild.bans.remove(userId, reason).catch(e => {})
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