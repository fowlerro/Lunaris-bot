import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

export interface Reactions {
    reaction: string,
    roleId: Snowflake;
    mode: string;
}

export interface ReactionRoleDocument extends Document {
    guildId: Snowflake;
    channelId: Snowflake;
    messageId: Snowflake;
    reactions: Reactions[];
}

const ReactionRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    reactions: [{
        reaction: {
            type: String,
            required: true
        },
        roleId: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            required: true
        }
    }]
})

ReactionRoleSchema.index({ guildId: 1, channelId: 1, messageId: 1 }, { unique: true })

export const ReactionRoleModel = model<ReactionRoleDocument>('ReactionRole', ReactionRoleSchema)