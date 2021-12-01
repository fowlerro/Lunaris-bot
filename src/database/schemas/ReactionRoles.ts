import { getModelForClass, index, mongoose, prop } from "@typegoose/typegoose"
import { Snowflake } from "discord-api-types"

export class Reactions {
    @prop({ required: true })
    public reaction!: string

    @prop({ required: true })
    public roleId!: Snowflake

    @prop({ required: true })
    public mode!: string
}

@index({ guildId: 1, channelId: 1, messageId: 1 }, { unique: true })
export class ReactionRole {
    @prop({ required: true })
    public guildId!: Snowflake

    @prop({ required: true })
    public channelId!: Snowflake

    @prop({ required: true })
    public messageId!: Snowflake

    @prop({ type: mongoose.Schema.Types.Mixed, default: [] })
    public reactions!: Reactions[]
}

export const ReactionRoleModel = getModelForClass(ReactionRole)