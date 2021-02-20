const AutoMod = require("../database/schemas/AutoMod");
const GuildConfig = require("../database/schemas/GuildConfig");
const GuildMembers = require("../database/schemas/GuildMembers");
const ms = require('ms');
const { translate } = require("./languages/languages");
const { generateId } = require("../database/utils");

const permissions = {
    CREATE_INSTANT_INVITE: 0x1,
    KICK_MEMBERS: 0x2,
    BAN_MEMBERS: 0x4,
    ADMINISTRATOR: 0x8,
    MANAGE_CHANNELS: 0x10,
    MANAGE_GUILD: 0x20,
    ADD_REACTIONS: 0x40,
    VIEW_AUDIT_LOG: 0x80,
    PRIORITY_SPEAKER: 0x100,
    STREAM: 0x200,
    VIEW_CHANNEL: 0x400,
    SEND_MESSAGES: 0x800,
    SEND_TTS_MESSAGES: 0x1000,
    MANAGE_MESSAGES: 0x2000,
    EMBED_LINKS: 0x4000,
    ATTACH_FILES: 0x8000,
    READ_MESSAGE_HISTORY: 0x10000,
    MENTION_EVERYONE: 0x20000,
    USE_EXTERNAL_EMOJIS: 0x40000,
    VIEW_GUILD_INSIGHTS: 0x80000,
    CONNECT: 0x100000,
    SPEAK: 0x200000,
    MUTE_MEMBERS: 0x400000,
    DEAFEN_MEMBERS: 0x800000,
    MOVE_MEMBERS: 0x1000000,
    USE_VAD: 0x2000000,
    CHANGE_NICKNAME: 0x4000000,
    MANAGE_NICKNAMES: 0x8000000,
    MANAGE_ROLES: 0x10000000,
    MANAGE_WEBHOOKS: 0x20000000,
    MANAGE_EMOJIS: 0x40000000,
} 

function convertPerms(to, permission) {
    if(to==='flags') {
        let convertedPerms = [];
        for(const [key, value] of Object.entries(permissions)) {
            if((permission & value) === value) {
                convertedPerms.push(key);
            }
        }
        return convertedPerms;
    } else if(to==='bits') {
        return null
    }
}

function replacer(key, value) {
    if(value instanceof Map) {
        return {
            "msg": value, // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function mapToObject(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
      if (value instanceof Map) {
        out[key] = mapToObject(value)
      }
      else {
        out[key] = value
      }
    })
    if(!out) return {}
    return out
}

function JSONToMap(map, json) {
    if(!json) json = {}
    json = JSON.parse(json);
    for(let v in json) {
        map.set(v, json[v])
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

async function setGuildConfig(client, guildID, toSet, value) {
    await GuildConfig.findOneAndUpdate({guildID}, {
        [toSet]: value
    });
    let config = client.guildConfigs.get(guildID);
    config[toSet] = value;
    client.guildConfigs.set(guildID, config);
    return client.guildConfigs.get(guildID);
}

async function setAutoModConfig(client, guildID, state, toSet, value) {

    if(state === 'add') {
        const config = await AutoMod.findOneAndUpdate({guildID}, {
            $addToSet: {
                [toSet]: value
            }
        }, {new: true, upsert: true});
        client.autoModConfigs.set(guildID, config);
        return client.autoModConfigs.get(guildID);
    } else if(state === 'remove') {
        const config = await AutoMod.findOneAndUpdate({guildID}, {
            $pullAll: {
                [toSet]: value
            }
        }, {new: true, upsert: true});
        client.autoModConfigs.set(guildID, config);
        return client.autoModConfigs.get(guildID);
    }
}

const Warn = {
    add: async (guildID, userID, reason, by, time = null) => {
        try {
            if(time) {
                time = ms(time) + Date.now();
            }
            await GuildMembers.findOneAndUpdate({guildID, userID}, {
                $push: {
                    warns: {reason, time, by, id: await generateId()}
                }
            }, {upsert: true});
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    },
    remove: async (guildID, id) => {
        try {
            const result = await GuildMembers.findOneAndUpdate({'warns.id': id}, {
                $pull: {
                    warns: {id}
                }
            });
            return result;
        } catch(err) {
            console.log(err);
            return false;
        }
    },
    list: async (client, guildID, userID) => {
        try {
            const guildConfig = client.guildConfigs.get(guildID);
            const language = guildConfig.get('language');
            let result;
            if(userID) {
                result = await GuildMembers.findOne({guildID, userID});
                if(!result.warns.length) return translate(language, 'general.none');
                return result.warns.map((v, i) => `${i+1}. ${translate(language, 'general.reason')}: ${v.reason ? v.reason : translate(language, 'general.none')} | ${translate(language, 'general.by').toLowerCase()}: <@${v.by}> | id: ` + "`" + v.id + "` | " + new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'short'}).format(v.date));
            } else {
                result = await GuildMembers.find({guildID});
                if(!result.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return translate(language, 'general.none');
                let index = 0;
                return result.map((vv, ii) => {
                    return vv.warns.map((v, i) => {
                        index++;
                        return `${index}. <@${vv.userID}> ${translate(language, 'general.by').toLowerCase()} <@${v.by}> ${translate(language, 'general.reason').toLowerCase()}: ${v.reason ? `| ${v.reason}` : translate(language, 'general.none')} | id: ` + "`" + v.id + "` | " + new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'short'}).format(v.date) + `\n`;
                    }).join('');
                });
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}

module.exports = {convertPerms, replacer, JSONToMap, mapToObject, daysInMonth, setGuildConfig, setAutoModConfig, Warn};