import { getModelForClass, index, modelOptions, mongoose, prop, Severity } from "@typegoose/typegoose"
import { Snowflake } from "discord-api-types"

class Roles {
    @prop({ required: true })
    public roleId!: Snowflake

    @prop({ required: true })
    public timestamp!: number
}

@index({ guildId: 1, userId: 1}, { unique: true })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class AutoRoleTime {
    @prop({ required: true })
    public guildId!: Snowflake

    @prop({ required: true })
    public userId!: Snowflake

    @prop({ type: mongoose.Schema.Types.Mixed, default: [] })
    public roles!: Roles[]
}

export const AutoRoleTimeModel = getModelForClass(AutoRoleTime)
