import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Snowflake } from "discord-api-types";

import { palette } from "../../utils/utils";

class XpStatistics {
    @prop({ required: true, default: 1 })
    public level!: number

    @prop({ required: true, default: 0 })
    public xp!: number

    @prop({ required: true, default: 0 })
    public totalXp!: number

    @prop({ required: true, default: 0 })
    public dailyXp!: number

    public cooldown?: boolean
}

class VoiceStatistics extends XpStatistics {
    @prop({ required: true, default: 0 })
    public timeSpent!: number
}

export class ProfileStatistics {
    @prop()
    public text!: XpStatistics

    @prop()
    public voice!: VoiceStatistics
}

class ProfileCard {
    @prop({ default: 0 })
    public background!: number

    @prop()
    public customBackground?: Types.Buffer

    @prop({ default: palette.primary })
    public accent!: string
}

export class Profile {
    @prop({ required: true, unique: true })
    public userId!: Snowflake

    @prop({ default: 0 })
    public coins!: number

    @prop()
    public statistics!: ProfileStatistics

    @prop()
    public cardAppearance!: ProfileCard
}

export const ProfileModel = getModelForClass(Profile)