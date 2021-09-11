const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = require("graphql")

const GuildConfigLogsType = new GraphQLObjectType({
    name: 'GuildConfigLogsType',
    fields: () => ({
        member: { type: GraphQLString },
        channel: { type: GraphQLString },
        voice: { type: GraphQLString },
        roles: { type: GraphQLString },
        message: { type: GraphQLString },
        commands: { type: GraphQLString },
        invites: { type: GraphQLString },
    })
})

const AutoRoleModuleType = new GraphQLObjectType({
    name: 'AutoRoleModuleType',
    fields: () => ({
        status: { type: GraphQLBoolean },
    })
})

const AutoModModuleType = new GraphQLObjectType({
    name: 'AutoModModuleType',
    fields: () => ({
        muteRole: { type: GraphQLString },
    })
})

const LevelUpMessageType = new GraphQLObjectType({
    name: 'LevelUpMessageType',
    fields: () => ({
        mode: { type: GraphQLString },
        channelId: { type: GraphQLString }
    })
})

const XpModuleType = new GraphQLObjectType({
    name: 'XpModuleType',
    fields: () => ({
        levelUpMessage: { type: LevelUpMessageType },
        multiplier: { type: GraphQLFloat }
    })
})

const GuildConfigModulesType = new GraphQLObjectType({
    name: 'GuildConfigModulesType',
    fields: () => ({
        autoRole: { type: AutoRoleModuleType },
        autoMod: { type: AutoModModuleType },
        xp: { type: XpModuleType },
    })
})

const GuildConfigType = new GraphQLObjectType({
    name: 'GuildConfigType',
    fields: () => ({
        guildId: { type: GraphQLString },
        prefix: { type: GraphQLString },
        language: { type: GraphQLString },
        logs: { type: GuildConfigLogsType },
        modules: { type: GuildConfigModulesType }
    })
});

module.exports = { GuildConfigType }