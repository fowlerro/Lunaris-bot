const { GraphQLInputObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = require("graphql");

const GuildConfigLogsInput = new GraphQLInputObjectType({
    name: 'GuildConfigLogsInput',
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

const AutoRoleModuleInput = new GraphQLInputObjectType({
    name: 'AutoRoleModuleInput',
    fields: () => ({
        status: { type: GraphQLBoolean },
    })
})

const AutoModModuleInput = new GraphQLInputObjectType({
    name: 'AutoModModuleInput',
    fields: () => ({
        muteRole: { type: GraphQLString },
    })
})

const LevelUpMessageInput = new GraphQLInputObjectType({
    name: 'LevelUpMessageInput',
    fields: () => ({
        mode: { type: GraphQLString },
        channelId: { type: GraphQLString }
    })
})

const XpModuleInput = new GraphQLInputObjectType({
    name: 'XpModuleInput',
    fields: () => ({
        levelUpMessage: { type: LevelUpMessageInput },
        multiplier: { type: GraphQLFloat }
    })
})

const GuildConfigModulesInput = new GraphQLInputObjectType({
    name: 'GuildConfigModulesInput',
    fields: () => ({
        autoRole: { type: AutoRoleModuleInput },
        autoMod: { type: AutoModModuleInput },
        xp: { type: XpModuleInput },
    })
})

const GuildConfigInput = new GraphQLInputObjectType({
    name: 'GuildConfigInput',
    fields: () => ({
        prefix: { type: GraphQLString },
        language: { type: GraphQLString },
        logs: { type: GuildConfigLogsInput },
        modules: { type: GuildConfigModulesInput }
    })
});

module.exports = { GuildConfigInput }