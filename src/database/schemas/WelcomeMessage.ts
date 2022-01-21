import { Document, model, Schema } from "mongoose";

import { WelcomeMessage, WelcomeMessageFormat } from 'types'

export interface WelcomeMessageDocument extends WelcomeMessage, Document {}

const WelcomeMessageSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        minlength: 18,
        maxlength: 18
    },
    status: {
        type: Boolean,
        default: false
    },
    channels: {
        join: {
            type: String,
            default: null,
            minlength: 18,
            maxlength: 18
        },
        leave: {
            type: String,
            default: null,
            minlength: 18,
            maxlength: 18
        }
    },
    formats: [{
        message: {
            type: String,
            required: true,
            maxlength: [256, 'Message cannot exceed 256 characters!']
        },
        action: {
            type: String,
            enum: ['join', 'leave'],
            default: 'join'
        }
    }]
})

export const WelcomeMessageModel = model<WelcomeMessageDocument>('WelcomeMessage', WelcomeMessageSchema);