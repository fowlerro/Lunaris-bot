import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

export interface GuildBanDocument extends Document {
    guildId: Snowflake;
    userId: Snowflake;
    executorId: Snowflake;
    reason?: string;
    time?: number
}

const GuildBanSchema = new Schema({
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
    executorId: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
    },
    reason: {
        type: String,
        maxlength: 1000
    },
    time: {
        type: Number
    }
})

GuildBanSchema.index({ guildId: 1, userId: 1 }, { unique: true })

export const GuildBanModel = model<GuildBanDocument>('GuildBan', GuildBanSchema)