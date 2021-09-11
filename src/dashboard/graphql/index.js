const {GraphQLObjectType, GraphQLSchema} = require('graphql');

const { getUser } = require('./User/query')
const { getMutualGuilds, getGuildConfig, getGuildRoles } = require('./Guilds/query')
const { updateGuildConfig } = require('./Guilds/mutation')

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser,
        getMutualGuilds,
        getGuildConfig,
        getGuildRoles,
    }
});

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields: {
        updateGuildConfig
    }
})

module.exports = new GraphQLSchema({ query: RootQuery, mutation: MutationQuery })