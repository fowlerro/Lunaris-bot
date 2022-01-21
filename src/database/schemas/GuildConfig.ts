import { Document, model, Schema } from "mongoose";

import { GuildConfig } from 'types'

export interface GuildConfigDocument extends GuildConfig, Document {}

const GuildConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        minlength: 18,
        maxlength: 18
    },
    modules: {
        autoMod: {
            muteRole: {
                type: String
            }
        },
        xp: {
            levelUpMessage: {
                mode: {
                    type: String,
                    default: 'currentChannel'
                },
                channelId: {
                    type: String,
                    minlength: 18,
                    maxlength: 18
                }
            },
            multiplier: {
                type: Number,
                default: 1
            }
        }
    }
})

GuildConfigSchema.index({ guildId: 1 })

export const GuildConfigModel = model<GuildConfigDocument>('GuildConfig', GuildConfigSchema)