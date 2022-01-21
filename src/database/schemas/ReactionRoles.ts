import { Document, model, Schema } from "mongoose";

import { ReactionRole } from 'types'

export interface ReactionRoleDocument extends Omit<ReactionRole, '_id'>, Document {}

const ReactionRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
    },
    channelId: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
    },
    messageId: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
    },
    reactions: [{
        reaction: {
            type: String,
            required: true,
            maxlength: 100
        },
        roleId: {
            type: String,
            required: true,
            minlength: 18,
            maxlength: 18
        },
        mode: {
            type: String,
            required: true,
            enum: ['normal', 'verify']
        }
    }]
})

ReactionRoleSchema.index({ guildId: 1, channelId: 1, messageId: 1 }, { unique: true })

export const ReactionRoleModel = model<ReactionRoleDocument>('ReactionRole', ReactionRoleSchema)