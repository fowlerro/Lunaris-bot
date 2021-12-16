import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

export interface OAuth2CredentialsDocument extends Document {
    accessToken: string;
    refreshToken: string;
    discordId: Snowflake;
}

const OAuth2CredentialsSchema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true
    }
})

export const OAuth2CredentialsModel = model<OAuth2CredentialsDocument>('OAuth2Credentials', OAuth2CredentialsSchema)