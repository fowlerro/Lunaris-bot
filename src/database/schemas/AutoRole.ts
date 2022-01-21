import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

import { AutoRoleRole } from 'types'
export interface AutoRoleDocument extends Document {
    guildId: Snowflake;
    roles: AutoRoleRole[]
}

const AutoRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        minlength: 18,
        maxlength: 18
    },
    roles: [{
        roleId: {
            type: String,
            required: true,
            minlength: 18,
            maxlength: 18
        },
        time: {
            type: Number
        }
    }]
})

AutoRoleSchema.index({ guildId: 1 })

export const AutoRoleModel = model<AutoRoleDocument>('AutoRole', AutoRoleSchema);