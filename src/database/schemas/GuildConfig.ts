// const mongoose = require('mongoose');
import { Document, Schema, model } from "mongoose";

// https://stackoverflow.com/questions/34482136/mongoose-the-typescript-way/36661990

const GuildConfigSchema = new mongoose.Schema({
    guildId: {
        type: String,
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
        },
        channel: {
            type:mongoose.SchemaTypes.String,
        },
        voice: {
            type:mongoose.SchemaTypes.String,
        },
        roles: {
            type:mongoose.SchemaTypes.String,
        },
        message: {
            type:mongoose.SchemaTypes.String,
        },
        commands: {
            type:mongoose.SchemaTypes.String,
        },
        invites: {
            type:mongoose.SchemaTypes.String,
        },
    },
    modules: {
        autoRole: {
            status: mongoose.SchemaTypes.Boolean,
        },
        autoMod: {
            muteRole: {
                type: mongoose.SchemaTypes.String,
            }
        },
        xp: {
            levelUpMessage: {
                mode: {
                    type: mongoose.SchemaTypes.String,
                    default: 'currentChannel' // off || currentChannel || specificChannel
                },
                channelId: {
                    type: mongoose.SchemaTypes.String
                }
            },
            multiplier: {
                type: mongoose.SchemaTypes.Number,
                default: 1
            }
        }
    }
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);