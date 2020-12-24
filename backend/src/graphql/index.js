const {GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLSchema} = require('graphql');
const { getUserGuilds, getBotGuilds, getGuildRoles } = require('../utils/api');
const { getMutualGuilds } = require('../utils/utils');
const GuildConfig = require('../database/schemas/GuildConfig');

const GuildType = new GraphQLObjectType({
    name: 'GuildType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        icon: { type: GraphQLString },
        owner: { type: GraphQLBoolean },
        permissions: { type: GraphQLInt },
        features: { type: new GraphQLList(GraphQLString) },
        permissions_new: { type: GraphQLString },
    })
})

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        discordTag: { type: GraphQLString },
        discordID: { type: GraphQLString },
        avatar: { type: GraphQLString },
        guilds: {
            type: new GraphQLList(GuildType),
            resolve(parent, args, request) {
                return request.user ? getUserGuilds(request.user.discordID) : null;
            }
        }
    })
});

const MutualGuildType = new GraphQLObjectType({
    name: 'MutualGuildType',
    fields: () => ({
        excluded: { type: new GraphQLList(GuildType) },
        included: { type: new GraphQLList(GuildType) },
    })
});

const GuildConfigType = new GraphQLObjectType({
    name: 'GuildConfigType',
    fields: () => ({
        guildID: { type: GraphQLString },
        prefix: { type: GraphQLString },
    })
});

const GuildRoleType = new GraphQLObjectType({
    name: 'GuildRoleType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        color: { type: GraphQLInt },
        hoist: { type: GraphQLBoolean },
        position: { type: GraphQLInt },
        permissions: { type: GraphQLInt },
        permissions_new: { type: GraphQLString },
        managed: { type: GraphQLBoolean },
        mentionable: { type: GraphQLBoolean },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser: {
            type: UserType,
            resolve(parent, args, request) {
                return request.user ? request.user : null;
            }
        },
        getMutualGuilds: {
            type: MutualGuildType,
            async resolve(parent, args, request) {
                if(request.user) {
                    const botGuilds = await getBotGuilds();
                    const userGuilds = await getUserGuilds(request.user.discordID);
                    return getMutualGuilds(userGuilds, botGuilds);
                } return null;
            }
        },
        getGuildConfig: {
            type: GuildConfigType,
            args: {
                guildID: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const { guildID } = args;
                if(!guildID || !request.user) return null;
                const config = await GuildConfig.findOne({guildID});
                return config ? config : null;
            }
        },
        getGuildRoles: {
            type: GraphQLList(GuildRoleType),
            args: {
                guildID: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const {guildID} = args;
                if(!guildID || !request.user) return null;
                return getGuildRoles(guildID);
            }
        }
    }
});

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields: {
        updateGuildConfig: {
            type: GuildConfigType,
            args: {
                guildID: { type: GraphQLString },
                prefix: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const {guildID, prefix} = args;
                if(!guildID || !prefix || !request.user) return null;
                const config = await GuildConfig.findOneAndUpdate({guildID}, {prefix}, {new: true});
                return config ? config : null;
            }
        },
    }
})

module.exports = new GraphQLSchema({query: RootQuery, mutation: MutationQuery })