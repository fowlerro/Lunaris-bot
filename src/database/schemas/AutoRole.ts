import { getModelForClass, modelOptions, mongoose, prop, Severity } from "@typegoose/typegoose"
import { Snowflake } from "discord-api-types"

class Roles {
    @prop({ required: true })
    public roleId!: Snowflake

    @prop({ required: true })
    public time!: number
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class AutoRole {
    @prop({ required: true, unique: true })
    public guildId!: Snowflake

    @prop({ type: mongoose.Schema.Types.Mixed, default: [] })
    public roles!: Roles[]
}

export const AutoRoleModel = getModelForClass(AutoRole)