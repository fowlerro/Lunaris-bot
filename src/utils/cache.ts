import { createClient, RedisClientType, RedisModules, RedisScripts } from 'redis'

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379'

const guildConfigs = createClient({ database: 0, url: redisURL })
const profiles = createClient({ database: 1, url: redisURL })
const guildProfiles = createClient({ database: 2, url: redisURL })
const autoRoles = createClient({ database: 3, url: redisURL })
const welcomeMessages = createClient({ database: 4, url: redisURL })
const levelConfigs = createClient({ database: 5, url: redisURL })
const logConfigs = createClient({ database: 6, url: redisURL })

export async function initializeCache() {
    await guildConfigs.connect()
    await profiles.connect()
    await guildProfiles.connect()
    await autoRoles.connect()
    await welcomeMessages.connect()
    await levelConfigs.connect()
    await logConfigs.connect()
}

export type Cache = {
    guildConfigs: RedisClientType<RedisModules, RedisScripts>
    profiles: RedisClientType<RedisModules, RedisScripts>
    guildProfiles: RedisClientType<RedisModules, RedisScripts>
    autoRoles: RedisClientType<RedisModules, RedisScripts>
    welcomeMessages: RedisClientType<RedisModules, RedisScripts>
    levelConfigs: RedisClientType<RedisModules, RedisScripts>
    logConfigs: RedisClientType<RedisModules, RedisScripts>
}

export default {
    guildConfigs,
    profiles,
    guildProfiles,
    autoRoles,
    welcomeMessages,
    levelConfigs,
    logConfigs,
}