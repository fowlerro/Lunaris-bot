import { Formatters, Guild, GuildMember, Permissions, User } from "discord.js"
import { Snowflake } from "discord-api-types"

import { GuildBanModel } from "../../database/schemas/GuildBans"
import Logs from "../Logs"
import { Language } from "types"

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
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'

        let timestamp: number = 0;
        const date = Date.now();
        if(time) timestamp = date + time;
        if(!timestamp) {
            const result = await guild.bans.create(targetId, { reason }).catch((e) => console.log(e))
            await Logs.log('members', 'ban', guild.id, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId,  reason: reason || t('general.none', language), unbanDate: t('general.never', language), unbanDateR: " " }})
    
            return { error: null, result }
        }
        const result = await saveBan(targetId, guild, executorId, reason, time, timestamp)
        if(!result) return { error: "Something went wrong" }

        return { result }
    },
    remove: async (targetId: Snowflake, guildId: Snowflake, executorId: Snowflake, reason?: string) => {
        if(!targetId) return { error: "Missing targetId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {});
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const target = await guild.members.fetch(targetId).catch(() => {}) || await client.users.fetch(targetId).catch(() => {})
        if(!target) return { error: "Wrong targetId" }
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'
        
        const result = await guild.bans.remove(targetId, reason).catch(e => {})
        if(!result) return { error: "notBanned" }
        await Logs.log('members', 'unban', guild.id, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId, reason: reason || t('general.none', language) } })

        return { result };
    }
}

async function saveBan(userId: Snowflake, guild: Guild, executorId: Snowflake, reason?: string, time?: number, timestamp?: number) {
    const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'
    const user = await client.users.fetch(userId).catch(e => console.log(e))
    const result = await guild.bans.create(userId, { reason }).catch(e => {})
    if(!result) return;

    await GuildBanModel.findOneAndUpdate({ guildId: guild.id, userId }, {
        executorId,
        reason,
        time: timestamp
    }, { upsert: true, runValidators: true }).catch(e => console.log(e));

    await Logs.log('members', 'ban', guild.id, { member: user, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId,  reason: reason || t('general.none', language), unbanDate: timestamp ? Formatters.time(Math.floor(timestamp / 1000)) : t('general.never', language), unbanDateR: timestamp ? Formatters.time(Math.floor(timestamp / 1000), 'R') : " " }})

    setTimeout(async () => {
        if(!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return
        const unbanReason = t('autoMod.ban.removeReason', language, { reason: reason || t('general.none', language) })
        await guild.bans.remove(userId, unbanReason).catch(e => {})
        await GuildBanModel.findOneAndDelete({ userId, guildId: guild.id });
        await Logs.log('members', 'unban', guild.id, { member: user, customs: { moderatorMention: `<@${client.user?.id}>`, moderatorId: client.user?.id, reason: unbanReason }})
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