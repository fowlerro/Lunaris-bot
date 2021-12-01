import { getModelForClass, prop } from "@typegoose/typegoose";
import { Snowflake } from "discord-api-types";
import { Language } from "../../utils/languages/types";

class GuildLogs {
    member?: Snowflake
    channel?: Snowflake
    voice?: Snowflake
    roles?: Snowflake
    message?: Snowflake
    commands?: Snowflake
    invites?: Snowflake
}

interface GuildAutoRoleModule {
    status: boolean
}

interface GuildAutoModModule {
    muteRole: Snowflake
}

class LevelUpMessage {
    @prop({ default: 'currentChannel' })
    public mode!: 'off' | 'currentChannel' | 'specificChannel'

    @prop()
    public channelId?: Snowflake
}

class GuildXpModule {
    public levelUpMessage!: LevelUpMessage

    @prop({ default: 1 })
    public multiplier!: number
}
class GuildModules {
    public autoRole?: GuildAutoRoleModule
    public autoMod?: GuildAutoModModule
    public xp?: GuildXpModule
}

export class GuildConfig {
    @prop({ required: true, unique: true })
    public guildId!: Snowflake

    @prop({ required: true, default: '$'})
    public prefix!: string

    @prop({ required: true, default: 'en' })
    public language!: Language

    @prop()
    public logs?: GuildLogs

    @prop()
    public modules?: GuildModules
}

export const GuildConfigModel = getModelForClass(GuildConfig)