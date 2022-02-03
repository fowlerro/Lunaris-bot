import { Document, model, Schema } from "mongoose";

import type { ReactionRole } from 'types'

export interface ReactionRoleDocument extends Omit<ReactionRole, '_id'>, Document {}

const ReactionRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    reactions: [{
        reaction: {
            type: String,
            required: true
        },
        roleId: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            required: true
        }
    }]
})

ReactionRoleSchema.index({ guildId: 1, channelId: 1, messageId: 1 }, { unique: true })

export const ReactionRoleModel = model<ReactionRoleDocument>('ReactionRole', ReactionRoleSchema)