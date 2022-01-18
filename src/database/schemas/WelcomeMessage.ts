import { Document, model, Schema } from "mongoose";

import { WelcomeMessage } from 'types'

export interface WelcomeMessageDocument extends WelcomeMessage, Document {}

const WelcomeMessageSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    channels: {
        join: {
            type: String,
            default: null
        },
        leave: {
            type: String,
            default: null
        }
    },
    status: {
        type: Boolean,
        default: false
    },
    formats: [{
        message: String,
        action: {
            type: String,
            enum: ['join', 'leave'],
            default: 'join'
        }
    }]
})

export const WelcomeMessageModel = model<WelcomeMessageDocument>('WelcomeMessage', WelcomeMessageSchema);