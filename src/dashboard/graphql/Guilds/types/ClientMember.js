const { GraphQLObjectType, GraphQLString } = require("graphql");
const { DateScalar, TimestampScalar } = require("../../Scalars");

const ClientMemberType = new GraphQLObjectType({
    name: 'ClientMemberType',
    fields: () => ({
        displayHexColor: { type: GraphQLString },
        displayName: { type: GraphQLString },
        joinedAt: { type: DateScalar },
        joinedTimestamp: { type: TimestampScalar },
        nickname: { type: GraphQLString },
    })
})

module.exports = { ClientMemberType }