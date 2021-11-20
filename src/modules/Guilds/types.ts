import { Snowflake } from "discord-api-types";
import { Language } from "../../utils/languages/types";

interface GuildLogs {
    member: Snowflake
    channel: Snowflake
    voice: Snowflake
    roles: Snowflake
    message: Snowflake
    commands: Snowflake
    invites: Snowflake
}


interface AutoRoleModule {
    status: boolean
}

interface AutoModModule {
    muteRole: Snowflake
}

interface XpModule {
    levelUpMessage: {
        mode: 'off' | 'currentChannel' | 'specificChannel'
        channelId: Snowflake
    }
    multiplier: number
}

interface GuildModules {
    autoRole: AutoRoleModule
    autoMod: AutoModModule
    xp: XpModule
}

export interface GuildConfig {
    guildId: Snowflake
    prefix: string
    language: Language
    logs: GuildLogs
    modules: GuildModules
}