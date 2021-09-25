const {GraphQLObjectType, GraphQLSchema} = require('graphql');

const { getUser } = require('./User/query')
const { getMutualGuilds, getGuildConfig, getGuildRoles, getClientMember } = require('./Guilds/query')
const { getProfile } = require('./Profile/query')
const { updateGuildConfig, updateClientMember } = require('./Guilds/mutation')

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser,
        getMutualGuilds,
        getGuildConfig,
        getGuildRoles,
        getProfile,
        getClientMember,
    }
});

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields: {
        updateGuildConfig,
        updateClientMember
    }
})

module.exports = new GraphQLSchema({ query: RootQuery, mutation: MutationQuery })