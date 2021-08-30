const { Permissions } = require("discord.js");
const GuildBans = require("../../database/schemas/GuildBans");

const Ban = {
    add: async (client, userId, guildId, by, reason = null, time = null) => {
        if(!userId) return { error: "Missing userId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {})
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const user = await client.users.fetch(userId).catch(e => {})
        if(!user) return { error: "Wrong userId" }

        let timestamp = null;
        const date = Date.now();
        if(time) timestamp = date + time;
        if(!timestamp) return guild.bans.create(userId, {reason});
        const result = await saveBan(client, userId, guild, by, reason, time, timestamp)
        if(!result) return { error: "Something goes wrong" }

        return { result }
    },
    remove: async (client, userId, guildId, by, reason) => {
        if(!userId) return { error: "Missing userId" }
        if(!guildId) return { error: "Missing guildId" }
        const guild = await client.guilds.fetch(guildId).catch(e => {});
        if(!guild) return { error: "Wrong guildId" }
        if(!guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() }
        const user = await client.users.fetch(userId).catch(e => {})
        if(!user) return { error: "Wrong userId" }

        const result = await guild.bans.remove(userId, reason).catch(e => {})
        if(!result) return { error: "notBanned" }

        return { result };
    }
}

async function saveBan(client, userId, guild, by, reason, time, timestamp) {

    const result = await guild.bans.create(userId, {reason}).catch(e => {})
    if(!result) return;

    await GuildBans.create({
        userId,
        guildId: guild.id,
        by,
        reason,
        time: timestamp
    });

    setTimeout(async () => {
        await guild.bans.remove(userId, `Timed ban ended, reason: ${reason || 'none'}`).catch(e => {})
        await GuildBans.findOneAndDelete({ userId, guildId: guild.id });
    }, time);

    return true;
}

async function registerBans(client) {
    const collections = await GuildBans.find();
    for(const collection of collections) {
        const guild = await client.guilds.fetch(collection.guildId).catch(e => {})
        const user = await client.users.fetch(collection.userId).catch(e => {})
        if(collection.time < Date.now()) {
            await guild.bans.remove(user.id, `Timed ban ended, reason: ${collection.reason || 'none'}`).catch(e => {})

            collection.remove();
        }
        setTimeout(async () => {
            await guild.bans.remove(user.id, `Timed ban ended, reason: ${collection.reason || 'none'}`).catch(e => {})

            collection.remove();
        }, collection.time - Date.now());
    }
}

module.exports = { Ban, registerBans }