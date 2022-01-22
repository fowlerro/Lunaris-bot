import { createClient, RedisClientType, RedisModules, RedisScripts } from 'redis'

const guildConfigs = createClient({ database: 0 })
const profiles = createClient({ database: 1 })
const guildProfiles = createClient({ database: 2 })
const autoRoles = createClient({ database: 3 })
const welcomeMessages = createClient({ database: 4 })

export async function initializeCache() {
    await guildConfigs.connect()
    await profiles.connect()
    await guildProfiles.connect()
    await autoRoles.connect()
    await welcomeMessages.connect()
}

export type Cache = {
    guildConfigs: RedisClientType<RedisModules, RedisScripts>
    profiles: RedisClientType<RedisModules, RedisScripts>
    guildProfiles: RedisClientType<RedisModules, RedisScripts>
    autoRoles: RedisClientType<RedisModules, RedisScripts>
    welcomeMessages: RedisClientType<RedisModules, RedisScripts>
}

export default {
    guildConfigs,
    profiles,
    guildProfiles,
    autoRoles,
    welcomeMessages
}