import { getModelForClass, index, prop } from "@typegoose/typegoose"
import { Snowflake } from "discord-api-types"
import { ColorResolvable, MessageEmbed, MessageEmbedAuthor } from "discord.js"
import { palette } from "../../utils/utils"

class EmbedAuthor {
    @prop()
    public name!: string

    @prop()
    public url?: string

    @prop()
    iconURL?: string
}

class EmbedFooter {
    @prop()
    public text?: string

    @prop()
    public iconURL?: string
}

class EmbedImage {
    @prop()
    public url!: string

    @prop()
    public width?: number

    @prop()
    public height?: number
}

class EmbedField {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public value!: string
    @prop({ default: false })
    public inline!: boolean
}

export class EmbedData {
    @prop()
    public author?: EmbedAuthor

    @prop({ default: palette.info })
    public color!: ColorResolvable

    @prop()
    public description?: string

    @prop()
    public footer?: EmbedFooter

    @prop()
    public image?: EmbedImage

    @prop()
    public thumbnail?: EmbedImage

    @prop()
    public timestamp?: number

    @prop()
    public title?: string

    @prop()
    public url?: string

    @prop({ default: [] })
    public fields!: EmbedField[]
}

export class Embed {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public guildId!: Snowflake

    @prop({ required: true })
    public channelId!: Snowflake

    @prop({ required: true, unique: true })
    public messageId!: Snowflake

    @prop()
    public messageContent?: string

    @prop()
    public embed!: EmbedData
}

export const EmbedModel = getModelForClass(Embed)


// const mongoose = require('mongoose');
// const { palette } = require('../../utils/utils');

// const EmbedSchema = new mongoose.Schema({
//     name: {
//         type: String,
//     },
//     guildId: {
//         type: String,
//         required: true,
//     },
//     channelId: {
//         type: String
//     },
//     messageId: {
//         type: String
//     },
//     messageContent: {
//         type: String,
//     },
//     embed: {
//         author: {
//             name: String,
//             url: String,
//             iconURL: String
//         },
//         color: {
//             type: String,
//             default: palette.info
//         },
//         description: String,
//         footer: {
//             text: String,
//             iconURL: String
//         },
//         image: {
//             url: String,
//             width: Number,
//             height: Number
//         },
//         thumbnail: {
//             url: String,
//             width: Number,
//             height: Number
//         },
//         timestamp: {
//             display: {
//                 type: Boolean,
//                 default: true
//             },
//             timestamp: Number
//         },
//         title: String,
//         url: String,
//         fields: [{
//             name: String,
//             value: String,
//             inline: {
//                 type: Boolean,
//                 default: false
//             }
//         }]
//     },
// });

// module.exports = mongoose.model('Embed', EmbedSchema);