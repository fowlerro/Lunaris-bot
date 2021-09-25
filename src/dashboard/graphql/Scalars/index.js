const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')

const GraphQLBuffer = new GraphQLScalarType({
    name: "Buffer",
    serialize: value => Buffer.from(value)
})

const DateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue: value => new Date(value),
    serialize: value => value.toISOString(),
})

const TimestampScalar = new GraphQLScalarType({
    name: "Timestamp",
    serialize: value => {
        return (value instanceof Date) ? value.getTime() : value
    },
    parseValue: value => {
        try {
            return new Date(value)
        } catch(e) {
            return null
        }
    },
    parseLiteral: ast => {
        if(ast.kind === Kind.INT) return new Date(parseInt(ast.value))
        if(ast.kind === Kind.STRING) return this.parseValue(ast.value)
        return null
    }
})

module.exports = { GraphQLBuffer, DateScalar, TimestampScalar }