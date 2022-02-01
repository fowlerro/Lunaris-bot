import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";
import { ProfileStatistics } from "./Profile";

export interface GuildProfileWarn {
    _id: string
    executorId: Snowflake;
    reason: string | null;
    date: number;
}

export interface GuildProfileDocument extends Document {
    guildId: Snowflake;
    userId: Snowflake;
    statistics: ProfileStatistics;
    warns: GuildProfileWarn[];
}

const GuildProfileSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    statistics: {
        text: {
            level: {
                type: Number,
                default: 1
            },
            xp: {
                type: Number,
                default: 0
            },
            totalXp: {
                type: Number,
                default: 0
            },
            dailyXp: {
                type: Number,
                default: 0
            }
        },
        voice: {
            level: {
                type: Number,
                default: 1
            },
            xp: {
                type: Number,
                default: 0
            },
            totalXp: {
                type: Number,
                default: 0
            },
            dailyXp: {
                type: Number,
                default: 0
            },
            timeSpent: {
                type: Number,
                default: 0
            }
        }
    },
    warns: [{
        executorId: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            default: null,
        },
        date: {
            type: Number,
            default: Date.now()
        },
    }],
});

GuildProfileSchema.index({ guildId: 1, userId: 1 }, { unique: true });

export const GuildProfileModel = model<GuildProfileDocument>('GuildProfile', GuildProfileSchema);