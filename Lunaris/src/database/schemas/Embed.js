const mongoose = require('mongoose');
const { palette } = require('../../utils/utils');

const EmbedSchema = new mongoose.Schema({
    name: {
        type: String
    },
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String
    },
    messageId: {
        type: String
    },
    embed: {
        author: {
            name: String,
            url: String,
            iconURL: String
        },
        color: {
            type: String,
            default: palette.info
        },
        description: String,
        footer: {
            text: String,
            iconURL: String
        },
        image: {
            url: String,
            width: Number,
            height: Number
        },
        thumbnail: {
            url: String,
            width: Number,
            height: Number
        },
        timestamp: {
            display: {
                type: Boolean,
                default: true
            },
            timestamp: Number
        },
        title: String,
        url: String,
        fields: [{
            name: String,
            value: String,
            inline: {
                type: Boolean,
                default: false
            }
        }]
    },
});

module.exports = mongoose.model('Embed', EmbedSchema);