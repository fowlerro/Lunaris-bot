import { Snowflake } from 'discord.js'
import { Schema, model } from 'mongoose'

export interface User {
    id: string;
    discordId: Snowflake;
    accessToken: string;
    refreshToken: string;
}

const UserSchema = new Schema<User>({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
})


export const UserModel = model('User', UserSchema)