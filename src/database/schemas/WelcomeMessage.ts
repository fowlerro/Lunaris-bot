import { Document, model, Schema } from "mongoose";

import { WelcomeMessage } from 'types'

export interface WelcomeMessageDocument extends WelcomeMessage, Document {}

const WelcomeMessageSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    channelId: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: false
    },
    format: [{
        type: String,
        default: []
    }]
})

export const WelcomeMessageModel = model<WelcomeMessageDocument>('WelcomeMessage', WelcomeMessageSchema);