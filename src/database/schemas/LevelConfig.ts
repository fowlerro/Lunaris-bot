import { Document, model, Schema } from "mongoose";

import { LevelConfig } from "types";

export interface LevelConfigDocument extends LevelConfig, Document {}

const LevelConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        minlength: 18,
        maxlength: 18
    },
    multiplier: {
        type: Number,
        default: 1
    },
    levelUpMessage: {
        mode: {
            type: String,
            enum: ['off', 'currentChannel', 'specificChannel'],
            default: 'currentChannel'
        },
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        }
    }
})

export const LevelConfigModel = model<LevelConfigDocument>('LevelConfig', LevelConfigSchema)