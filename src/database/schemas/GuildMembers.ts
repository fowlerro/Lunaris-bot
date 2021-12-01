import { getModelForClass, index, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { Snowflake } from "discord-api-types";
import shortid from "shortid";

class XpStatistics {
    @prop({ required: true, default: 1 })
    public level!: number

    @prop({ required: true, default: 0 })
    public xp!: number

    @prop({ required: true, default: 0 })
    public totalXp!: number

    @prop({ required: true, default: 0 })
    public dailyXp!: number
}

class VoiceStatistics extends XpStatistics {
    @prop({ required: true, default: 0 })
    public timeSpent!: number
}

class GuildMemberStatistics {
    @prop()
    public text!: XpStatistics

    @prop()
    public voice!: VoiceStatistics
}

class GuildMemberMute {
    @prop({ default: false })
    public isMuted!: boolean
    
    @prop()
    public timestamp?: number

    @prop()
    public date?: number

    @prop()
    public reason?: string

    @prop()
    public by?: Snowflake | string
}

class GuildMemberWarn {
    @prop({ required: true, default: shortid.generate() })
    public id!: string

    @prop({ required: true })
    public by!: string

    @prop({ default: null })
    public reason?: string

    @prop({ required: true, default: Date.now() })
    public date!: number
}

@index({ guildId: 1, userId: 1 }, { unique: true })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GuildMember {
    @prop({ required: true })
    public guildId!: Snowflake

    @prop({ required: true })
    public userId!: Snowflake

    @prop()
    public statistics!: GuildMemberStatistics

    @prop()
    public mute!: GuildMemberMute

    @prop({ default: [] })
    public warns!: GuildMemberWarn[]
}


export const GuildMemberModel = getModelForClass(GuildMember)

// const mongoose = require('mongoose');
// const shortid = require('shortid');

// const GuildMembersSchema = new mongoose.Schema({
//     guildId: {
//         type: mongoose.SchemaTypes.String,
//         required: true,
//     },
//     userId: {
//         type: mongoose.SchemaTypes.String,
//         required: true,
//     },
//     statistics: {
//         text: {
//             level: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 1
//             },
//             xp: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             },
//             totalXp: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             },
//             dailyXp: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             }
//         },
//         voice: {
//             level: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 1
//             },
//             xp: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             },
//             totalXp: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             },
//             dailyXp: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             },
//             timeSpent: {
//                 type: mongoose.SchemaTypes.Number,
//                 default: 0
//             }
//         }
//     },
//     muted: {
//         isMuted: {
//             type: mongoose.SchemaTypes.Boolean,
//             default: false,
//         },
//         timestamp: {
//             type: mongoose.SchemaTypes.Number,
//         },
//         date: {
//             type: mongoose.SchemaTypes.Number,
//         },
//         reason: {
//             type: mongoose.SchemaTypes.String,
//         },
//         by: {
//             type: mongoose.SchemaTypes.String,
//         }
//     },
//     warns: [{
//         id: {
//             type: String,
//             default: shortid.generate(),
//         },
//         reason: {
//             type: mongoose.SchemaTypes.String,
//             default: null,
//         },
//         by: {
//             type: mongoose.SchemaTypes.String,
//         },
//         date: {
//             type: mongoose.SchemaTypes.Number,
//             default: Date.now()
//         },
//     }],
// });

// GuildMembersSchema.index({ guildId: 1, userId: 1 }, { unique: true });

// module.exports = mongoose.model('GuildMembers', GuildMembersSchema);