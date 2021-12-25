import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

import { AutoRoleRole } from 'types'
export interface AutoRoleTimeDocument extends Document {
    guildId: Snowflake
    userId: Snowflake
    roles: AutoRoleRole[]
}

const AutoRoleTimeSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    roles: [{
        roleId: {
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: true
        }
    }]
})

AutoRoleTimeSchema.index({ guildId: 1, userId: 1 }, { unique: true })

export const AutoRoleTimeModel = model<AutoRoleTimeDocument>('AutoRoleTime', AutoRoleTimeSchema)