import { getModelForClass, prop } from "@typegoose/typegoose";
import { Snowflake } from "discord-api-types";


export class OAuth2Credentials {
    @prop({ required: true })
    public accessToken!: string

    @prop({ required: true })
    public refreshToken!: string

    @prop({ required: true })
    public discordId!: Snowflake
}

export const OAuth2CredentialsModel = getModelForClass(OAuth2Credentials)