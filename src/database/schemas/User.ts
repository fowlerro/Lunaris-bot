import { Snowflake } from 'discord.js'
import { Document, Schema, model } from 'mongoose'
export interface UserDocument extends Document {
    discordId: Snowflake;
    discordTag: `${string}#${number}`;
    avatar: string;
}

const UserSchema = new Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    discordTag: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
})

UserSchema.index({ discordId: 1 }, { unique: true })

export const UserModel = model<UserDocument>('User', UserSchema)