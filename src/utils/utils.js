const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

const botOwners = ["313346190995619841"];

const palette = {
    primary: '#102693',
    secondary: '',
    success: '#7BDB27',
    info: '#3C9FFC',
    error: '#B71E13',
}

function mapToObject(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
      if(value instanceof Map) {
        out[key] = mapToObject(value)
      } else out[key] = value;
    })
    if(!out) return {}
    return out
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function msToTime(ms) {
    let result = ""
    let d = Math.floor((ms/(1000*60*60*24)) % 7);
    d && (result += d+'d '); 
    let h = Math.floor((ms/(1000*60*60)) % 24);
    h && (result += h+'h '); 
    let m = Math.floor((ms/(1000*60)) % 60);
    m && (result += m+'m '); 
    let s = Math.floor((ms/(1000)) % 60);
    s && (result += s+'s '); 
    return result.trimEnd();
}

function toggleBot(client, s) {
    if(!s) client.isOnline = !client.isOnline;
    if(s) client.isOnline = s;

    if(client.isOnline) {
        client.user.setPresence({
            status: 'online',
            activities: [{
                name: client.customActivity?.name || '',
                type: client.customActivity?.type || ''
            }]
        });
    }
    if(!client.isOnline) {
        client.user.setPresence({
            status: 'invisible'
        });
    }
    console.log(client.isOnline);
    return client.isOnline;
}

function setActivity(client, type, activity) {
    if(!type) return;
    client.customActivity = {
        name: activity,
        type: type.toUpperCase()
    }
    client.user.setPresence({
        activities: [{
            name: client.customActivity.name,
            type: client.customActivity.type
        }]
    })
}

async function getUserFromMention(client, mention) {
    if(!mention) return false;
    if(!isNaN(mention)) return client.users.fetch(mention).catch(err => console.error(err));
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) return false;

    return client.users.fetch(matches[1]);
}
async function getChannelFromMention(guild, mention) {
    if(!mention) return false
    const matches = mention.match(/^<#(\d+)>$/);
    if(!matches) return false;

    return guild.channels.fetch(matches[1]).catch(err => console.error(err))
}

function assignNestedObjects(obj, keyPath, value) {
    lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
      key = keyPath[i];
      if (!(key in obj)){
        obj[key] = {}
      }
      obj = obj[key];
    }
    if(obj[keyPath[lastKeyIndex]]) {
        if(obj[keyPath[lastKeyIndex]].includes(value)) return;
        obj[keyPath[lastKeyIndex]] = [value, ...obj[keyPath[lastKeyIndex]]]
    } else obj[keyPath[lastKeyIndex]] = [value]
}

function capitalize(string) {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}


module.exports = {botOwners, palette, mapToObject, groupBy, daysInMonth, 
    msToTime,
    toggleBot, setActivity,
    getUserFromMention, getChannelFromMention, assignNestedObjects, capitalize};