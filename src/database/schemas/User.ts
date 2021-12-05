import { getModelForClass, prop } from "@typegoose/typegoose";
import { Snowflake } from "discord-api-types";


export class User {
    @prop({ required: true, unique: true })
    public discordId!: Snowflake

    @prop({ required: true })
    public discordTag!: `${string}#${number}`

    @prop({ required: true })
    public avatar!: string
}

export const UserModel = getModelForClass(User)