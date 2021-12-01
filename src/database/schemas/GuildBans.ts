import { getModelForClass, index, prop } from "@typegoose/typegoose"
import { Snowflake } from "discord-api-types"


@index({ guildId: 1, userId: 1 }, { unique: true })
export class GuildBan {
    @prop({ required: true })
    public guildId!: Snowflake

    @prop({ required: true })
    public userId!: Snowflake

    @prop({ required: true })
    public by!: Snowflake

    @prop()
    public reason?: string

    @prop()
    public time?: number
}

export const GuildBanModel = getModelForClass(GuildBan)


// const mongoose = require('mongoose');

// const GuildBansSchema = new mongoose.Schema({
//     guildId: {
//         type: String,
//         required: true,
//     },
//     userId: {
//         type: String,
//         required: true,
//     },
//     by: {
//         type: String
//     },
//     reason: {
//         type: String,
//     },
//     time: {
//         type: mongoose.SchemaTypes.Date
//     }
// });

// GuildBansSchema.index({ guildId: 1, userId: 1 }, { unique: true });

// module.exports = mongoose.model('GuildBans', GuildBansSchema);