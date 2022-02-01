import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";

interface LogCategory {
    channelId?: Snowflake,
    logs?: { [log: string]: boolean }
}

export type GuildLogs = {
    guildId: Snowflake
    messages?: LogCategory
    emojis?: LogCategory
    roles?: LogCategory
    channels?: LogCategory
    threads?: LogCategory
    invites?: LogCategory
    members?: LogCategory
    server?: LogCategory
}

export interface GuildLogsDocument extends GuildLogs, Document {}

const GuildLogsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        minlength: 18,
        maxlength: 18
    },
    messages: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            edit: Boolean,
            delete: Boolean,
            purge: Boolean,
            pin: Boolean,
            unpin: Boolean,
        }
    },
    emojis: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            create: Boolean,
            delete: Boolean,
            edit: Boolean,
        }
    },
    roles: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            create: Boolean,
            delete: Boolean,
            edit: Boolean,
            add: Boolean,
            remove: Boolean,
        }
    },
    channels: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            created: Boolean,
            delete: Boolean,
            edit: Boolean,
        }
    },
    threads: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            create: Boolean,
            delete: Boolean,
            edit: Boolean,
        }
    },
    invites: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            create: Boolean,
            delete: Boolean,
        }
    },
    members: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            join: Boolean,
            leave: Boolean,
            warn: Boolean,
            unwarn: Boolean,
            unwarnAll: Boolean,
            kick: Boolean,
            timeout: Boolean,
            timeoutEnd: Boolean,
            ban: Boolean,
            unban: Boolean,
        }
    },
    server: {
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18
        },
        logs: {
            unwarnAl: Boolean,
        }
    }
})

export const GuildLogsModel = model<GuildLogsDocument>('GuildLogs', GuildLogsSchema)