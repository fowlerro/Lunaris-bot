import { Document, Schema, model } from 'mongoose'
import { User } from 'types'

export interface UserDocument extends User, Document {}

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
        type: String
    }
})

UserSchema.index({ discordId: 1 }, { unique: true })

export const UserModel = model<UserDocument>('User', UserSchema)