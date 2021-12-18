import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

interface Roles {
    roleId: Snowflake
    timestamp: number
}
export interface AutoRoleTimeDocument extends Document {
    guildId: Snowflake
    userId: Snowflake
    roles: Roles[]
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
        timestamp: {
            type: Number,
            required: true
        }
    }]
})

AutoRoleTimeSchema.index({ guildId: 1, userId: 1 }, { unique: true })

export const AutoRoleTimeModel = model<AutoRoleTimeDocument>('AutoRoleTime', AutoRoleTimeSchema)