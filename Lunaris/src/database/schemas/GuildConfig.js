const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
    guildID: {
        type: String,
        required: [true, "Guild ID is required"],
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
    modules: {
        autoRole: {
            status: mongoose.SchemaTypes.Boolean,
            default: false,
        },
        stats: {
            channel: {
                type: mongoose.SchemaTypes.String,
                default: null,
            }
        },
        autoMod: {
            muteRole: {
                type: mongoose.SchemaTypes.String,
            }
        }
    }
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);