const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { getUserGuilds } = require("../../../utils/api");
const { GuildType } = require("../../Guilds/types/Guild");

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        discordId: { type: GraphQLString },
        discordTag: { type: GraphQLString },
        avatar: { type: GraphQLString },
        guilds: {
            type: new GraphQLList(GuildType),
            resolve(parent, args, request) {
                return request.user ? getUserGuilds(request.user.discordId) : null;
            }
        }
    })
});

module.exports = { UserType }