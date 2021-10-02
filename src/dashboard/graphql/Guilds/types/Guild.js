const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLID, GraphQLList } = require("graphql");
const { TimestampScalar } = require("../../Scalars");

const GuildType = new GraphQLObjectType({
    name: 'GuildType',
    fields: () => ({
        id: { type: GraphQLID },
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
        id: { type: GraphQLID },
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

const PermissionsOverwriteType = new GraphQLObjectType({
    name: 'PermissionsOverwriteType',
    fields: () => ({
        id: { type: GraphQLID },
        type: { type: GraphQLInt },
        allow: { type: GraphQLString },
        deny: { type: GraphQLString },
    })
})

const ThreadMetadataType = new GraphQLObjectType({
    name: 'ThreadMetadataType',
    fields: () => ({
        archived: { type: GraphQLBoolean },
        auto_archive_duration: { type: GraphQLInt },
        archive_timestamp: { type: TimestampScalar },
        locked: { type: GraphQLBoolean },
        invitable: { type: GraphQLBoolean },
    })
})

const ThreadMemberType = new GraphQLObjectType({
    name: 'ThreadMemberType',
    fields: () => ({
        id: { type: GraphQLID },
        user_id: { type: GraphQLString },
        join_timestamp: { type: TimestampScalar },
        flags: { type: GraphQLInt },
    })
})

const GuildChannelType = new GraphQLObjectType({
    name: 'GuildChannelType',
    fields: () => ({
        id: { type: GraphQLID },
        type: { type: GraphQLInt },
        position: { type: GraphQLInt },
        permissions_overwrites: { type: new GraphQLList(PermissionsOverwriteType) },
        name: { type: GraphQLString },
        topic: { type: GraphQLString },
        nsfw: { type: GraphQLBoolean },
        last_message_id: { type: GraphQLString },
        bitrate: { type: GraphQLInt },
        user_limit: { type: GraphQLInt },
        rate_limit_per_user: { type: GraphQLInt },
        icon: { type: GraphQLString },
        owner_id: { type: GraphQLString },
        application_id: { type: GraphQLString },
        parent_id: { type: GraphQLString },
        last_pin_timestamp: { type: TimestampScalar },
        rtc_region: { type: GraphQLString },
        video_quality_mode: { type: GraphQLInt },
        message_count: { type: GraphQLInt },
        member_count: { type: GraphQLInt },
        thread_metadata: { type: ThreadMetadataType },
        member: { type: ThreadMemberType },
        default_auto_archive_duration: { type: GraphQLInt },
        permissions: { type: GraphQLString },
    })
})

const MutualGuildType = new GraphQLObjectType({
    name: 'MutualGuildType',
    fields: () => ({
        excluded: { type: new GraphQLList(GuildType) },
        included: { type: new GraphQLList(GuildType) },
    })
})

module.exports = { GuildType, GuildRoleType, MutualGuildType, GuildChannelType }