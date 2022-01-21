import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";
import { ProfileStatistics } from "./Profile";

export interface GuildProfileMute {
    isMuted: boolean;
    timestamp?: number | null;
    date?: number | null;
    reason?: string | null;
    executorId?: Snowflake | null;
}

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
    mute: GuildProfileMute;
    warns: GuildProfileWarn[];
}

const GuildProfileSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
    },
    userId: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
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
    mute: {
        isMuted: {
            type: Boolean,
            default: false,
        },
        timestamp: {
            type: Number,
        },
        date: {
            type: Number,
        },
        reason: {
            type: String,
        },
        executorId: {
            type: String,
        }
    },
    warns: [{
        executorId: {
            type: String,
            required: true,
            minlength: 18,
            maxlength: 18
        },
        reason: {
            type: String,
            default: null,
            maxlength: 1000
        },
        date: {
            type: Number,
            default: Date.now()
        },
    }],
});

GuildProfileSchema.index({ guildId: 1, userId: 1 }, { unique: true });

export const GuildProfileModel = model<GuildProfileDocument>('GuildProfile', GuildProfileSchema);