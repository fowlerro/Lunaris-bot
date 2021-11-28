import { getModelForClass, prop } from "@typegoose/typegoose";
import { Snowflake } from "discord-api-types";
import { Language } from "../../utils/languages/types";

interface GuildLogs {
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
    public guildId!: string

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

// const GuildConfigSchema = new mongoose.Schema({
//     guildId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     prefix: {
//         type: mongoose.SchemaTypes.String,
//         required: true,
//         default: '$',
//     },
//     language: {
//         type: mongoose.SchemaTypes.String,
//         required: true,
//         default: 'en',
//     },
//     logs: {
//         member: {
//             type:mongoose.SchemaTypes.String,
//         },
//         channel: {
//             type:mongoose.SchemaTypes.String,
//         },
//         voice: {
//             type:mongoose.SchemaTypes.String,
//         },
//         roles: {
//             type:mongoose.SchemaTypes.String,
//         },
//         message: {
//             type:mongoose.SchemaTypes.String,
//         },
//         commands: {
//             type:mongoose.SchemaTypes.String,
//         },
//         invites: {
//             type:mongoose.SchemaTypes.String,
//         },
//     },
//     modules: {
//         autoRole: {
//             status: mongoose.SchemaTypes.Boolean,
//         },
//         autoMod: {
//             muteRole: {
//                 type: mongoose.SchemaTypes.String,
//             }
//         },
//         xp: {
//             levelUpMessage: {
//                 mode: {
//                     type: mongoose.SchemaTypes.String,
//                     default: 'currentChannel' // off || currentChannel || specificChannel
//                 },
//                 channelId: {
//                     type: mongoose.SchemaTypes.String
//                 }
//             },
//             multiplier: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 1
//             }
//         }
//     }
// });

// module.exports = mongoose.model('GuildConfig', GuildConfigSchema);