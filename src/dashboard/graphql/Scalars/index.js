const { GraphQLScalarType } = require('graphql');

const GraphQLBuffer = new GraphQLScalarType({
    name: "Buffer",
    serialize: value => Buffer.from(value)
})

module.exports = { GraphQLBuffer }