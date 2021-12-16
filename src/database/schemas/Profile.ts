import { Snowflake } from "discord.js";
import mongoose, { Document, model, Schema } from "mongoose";
import { palette } from "../../utils/utils";

interface TextStatistics {
    level: number;
    xp: number;
    totalXp: number;
    dailyXp: number;
    cooldown?: boolean;
}

interface VoiceStatistics extends TextStatistics {
    timeSpent: number;
}
export interface ProfileStatistics {
    text: TextStatistics;
    voice: VoiceStatistics;
}

interface ProfileCard {
    background: number;
    customBackground?: Buffer;
    accent: string;
}

export interface ProfileDocument extends Document {
    userId: Snowflake;
    coins: number;
    statistics: ProfileStatistics;
    cardAppearance: ProfileCard;
}

const ProfileSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    coins: {
        type: Number,
        default: 0
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
    cardAppearance: {
        background: {
            type: Number,
            default: 0
        },
        customBackground: {
            type: Buffer
        },
        accent: {
            type: String,
            default: palette.primary
        }
    }
})

export const ProfileModel = mongoose.model<ProfileDocument>('Profiles', ProfileSchema);