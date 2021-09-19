const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } = require("graphql");

const GuildType = new GraphQLObjectType({
    name: 'GuildType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        icon: { type: GraphQLString },
        banner: { type: GraphQLString },
        owner: { type: GraphQLBoolean },
        permissions: { type: GraphQLInt },
        features: { type: new GraphQLList(GraphQLString) },
        permissions_new: { type: GraphQLString },
    })
})

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

const MutualGuildType = new GraphQLObjectType({
    name: 'MutualGuildType',
    fields: () => ({
        excluded: { type: new GraphQLList(GuildType) },
        included: { type: new GraphQLList(GuildType) },
    })
})

module.exports = { GuildType, GuildRoleType, MutualGuildType }