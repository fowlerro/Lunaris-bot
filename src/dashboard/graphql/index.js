const {GraphQLObjectType, GraphQLSchema} = require('graphql');

const { getUser } = require('./User/query')
const { getMutualGuilds, getGuildConfig, getGuildRoles, getClientMember } = require('./Guilds/query')
const { getProfile } = require('./Profile/query')
const { updateGuildConfig, updateClientMember } = require('./Guilds/mutation')
const { getEmbedMessage, getEmbedMessages } = require('./Embeds/query')
const { createEmbedMessage } = require('./Embeds/mutation')

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser,
        getMutualGuilds,
        getGuildConfig,
        getGuildRoles,
        getProfile,
        getClientMember,

        getEmbedMessage,
        getEmbedMessages,
    }
});

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields: {
        updateGuildConfig,
        updateClientMember,

        createEmbedMessage
    }
})

module.exports = new GraphQLSchema({ query: RootQuery, mutation: MutationQuery })