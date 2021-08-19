const mongoose = require('mongoose');
const { palette } = require('../../utils/utils');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    coins: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    statistics: {
        text: {
            level: {
                type: mongoose.SchemaTypes.Number,
                default: 1
            },
            xp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            totalXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            todayXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            }
        },
        voice: {
            level: {
                type: mongoose.SchemaTypes.Number,
                default: 1
            },
            xp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            totalXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            todayXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            timeSpent: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            }
        }
    },
    cardAppearance: {
        background: {
            type: mongoose.SchemaTypes.Number,
            default: 0
        },
        customBackground: {
            type: mongoose.SchemaTypes.Buffer
        },
        accent: {
            type: mongoose.SchemaTypes.String,
            default: palette.primary
        }
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);