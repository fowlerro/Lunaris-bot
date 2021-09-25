const { GraphQLInputObjectType, GraphQLString } = require("graphql");

const ClientMemberInput = new GraphQLInputObjectType({
    name: 'ClientMemberInput',
    fields: () => ({
        nickname: { type: GraphQLString },
    })
});

module.exports = { ClientMemberInput }