import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

interface AutoRoleRoles {
    roleId: Snowflake;
    time: number;
}
export interface AutoRoleDocument extends Document {
    guildId: Snowflake;
    roles: AutoRoleRoles[]
}

const AutoRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{
        roleId: {
            type: String,
            required: true
        },
        time: {
            type: Number
        }
    }]
})

AutoRoleSchema.index({ guildId: 1 })

export const AutoRoleModel = model<AutoRoleDocument>('AutoRole', AutoRoleSchema);