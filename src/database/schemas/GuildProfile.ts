import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";
import { ProfileStatistics } from "./Profile";

interface GuildProfileMute {
    isMuted: boolean;
    timestamp?: number | null;
    date?: number | null;
    reason?: string | null;
    executorId?: Snowflake | null;
}

interface GuildProfileWarn {
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