import { getModelForClass, prop } from "@typegoose/typegoose";
import { Snowflake } from "discord-api-types";
import { Language } from "../../utils/languages/types";

class GuildLogs {
    @prop()
    public member?: Snowflake
    
    @prop()
    public channel?: Snowflake
    
    @prop()
    public voice?: Snowflake
    
    @prop()
    public roles?: Snowflake
    
    @prop()
    public message?: Snowflake
    
    @prop()
    public commands?: Snowflake
    
    @prop()
    public invites?: Snowflake
}

class GuildAutoRoleModule {
    @prop({ default: false })
    public status!: boolean
}

class GuildAutoModModule {
    @prop()
    public muteRole?: Snowflake
}

class LevelUpMessage {
    @prop({ default: 'currentChannel' })
    public mode!: 'off' | 'currentChannel' | 'specificChannel'

    @prop()
    public channelId?: Snowflake
}

class GuildXpModule {
    @prop()
    public levelUpMessage!: LevelUpMessage

    @prop({ default: 1 })
    public multiplier!: number
}
class GuildModules {
    @prop()
    public autoRole!: GuildAutoRoleModule
    
    @prop()
    public autoMod?: GuildAutoModModule
    
    @prop()
    public xp!: GuildXpModule
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
    public modules!: GuildModules
}

export const GuildConfigModel = getModelForClass(GuildConfig)