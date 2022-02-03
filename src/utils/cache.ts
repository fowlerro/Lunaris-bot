import NodeCache from 'node-cache'

const guildConfigs = new NodeCache({ stdTTL: 60 * 10 })
const profiles = new NodeCache({ stdTTL: 60 * 10 })
const guildProfiles = new NodeCache({ stdTTL: 60 * 10 })
const autoRoles = new NodeCache({ stdTTL: 60 * 5 })
const welcomeMessages = new NodeCache({ stdTTL: 60 * 10 })
const levelConfigs = new NodeCache({ stdTTL: 60 * 10 })
const logConfigs = new NodeCache({ stdTTL: 60 * 5 })

export type Cache = {
    guildConfigs: NodeCache
    profiles: NodeCache
    guildProfiles: NodeCache
    autoRoles: NodeCache
    welcomeMessages: NodeCache
    levelConfigs: NodeCache
    logConfigs: NodeCache
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