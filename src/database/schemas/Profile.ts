import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Snowflake } from "discord-api-types";

import { palette } from "../../utils/utils";

class XpStatistics {
    @prop({ default: 1 })
    public level!: number

    @prop({ default: 0 })
    public xp!: number

    @prop({ default: 0 })
    public totalXp!: number

    @prop({ default: 0 })
    public dailyXp!: number

    public cooldown?: boolean

    constructor(level: number, xp: number, totalXp: number, dailyXp: number) {
        this.level = level
        this.xp = xp
        this.totalXp = totalXp
        this.dailyXp = dailyXp
    }
}

class VoiceStatistics extends XpStatistics {
    @prop({ default: 0 })
    public timeSpent!: number

    constructor(level: number, xp: number, totalXp: number, dailyXp: number, timeSpent: number) {
        super(level, xp, totalXp, dailyXp)
        this.timeSpent = timeSpent
    }
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