import { Snowflake } from "discord.js";

export type MemberLogs = 'memberJoin' | 'memberLeave' | 'memberKick' | 'memberBan' | 'memberTimeout'

export interface Config {
    members: {
        channelId: Snowflake
        logs: { [log in MemberLogs]?: boolean }
    }
}