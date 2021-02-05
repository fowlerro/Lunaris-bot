const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: '$',
    },
    language: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: 'en',
    },
    logs: {
        member: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
        channel: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
        voice: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
        roles: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
        message: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
        commands: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
        invites: {
            type:mongoose.SchemaTypes.String,
            default: null,
        },
    },
    stats: {
        channel: {
            type: mongoose.SchemaTypes.String,
            default: null,
        }
    }
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);