import { Document, model, Schema } from "mongoose";

import { AutoRole } from 'types'

export interface AutoRoleDocument extends AutoRole, Document {}

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