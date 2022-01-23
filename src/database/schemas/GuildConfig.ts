import { Document, model, Schema } from "mongoose";

import { GuildConfig } from 'types'

export interface GuildConfigDocument extends GuildConfig, Document {}

const GuildConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    muteRole: {
        type: String,
        minlength: 18,
        maxlength: 18
    },
    modules: {
        autoRole: {
            type: Boolean,
            default: false
        },
        welcomeMessage: {
            type: Boolean,
            default: false
        },
    }
})

GuildConfigSchema.index({ guildId: 1 })

export const GuildConfigModel = model<GuildConfigDocument>('GuildConfig', GuildConfigSchema)