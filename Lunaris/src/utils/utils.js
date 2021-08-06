const AutoMod = require("../database/schemas/AutoMod");
const GuildConfig = require("../database/schemas/GuildConfig");
const { MessageButton, MessageActionRow } = require('discord-buttons');
const { MessageEmbed } = require("discord.js");

const botOwners = ["313346190995619841"];

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
    USE_SLASH_COMMANDS: 0x0080000000,
    REQUEST_TO_SPEAK: 0x0100000000,
    MANAGE_THREADS: 0x0400000000,
    USE_PUBLIC_THREADS: 0x0800000000,
    USE_PRIVATE_THREADS: 0x1000000000
} 

const palette = {
    primary: '#102693',
    secondary: '',
    success: '#7BDB27',
    info: '#3C9FFC',
    error: '#B71E13',
}

function convertPerms(to, permission) {
    if(to === 'flags') {
        let convertedPerms = [];
        for(const [key, value] of Object.entries(permissions)) {
            if((permission & value) === value) convertedPerms.push(key);
        }
        return convertedPerms;
    }
    if(to === 'bits') return null;
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


// ! Deprecated
function JSONToMap(map, json) {
    if(!json) json = {};
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

async function setAutoModConfig(client, guildID, state, toSet, value) {
    if(state === 'add') {
        const config = await AutoMod.findOneAndUpdate({guildID}, {
            $addToSet: {
                [toSet]: value
            }
        }, {new: true, upsert: true});
        client.autoModConfigs.set(guildID, config);
        return client.autoModConfigs.get(guildID);
    }
    
    if(state === 'remove') {
        const config = await AutoMod.findOneAndUpdate({guildID}, {
            $pullAll: {
                [toSet]: value
            }
        }, {new: true, upsert: true});
        client.autoModConfigs.set(guildID, config);
        return client.autoModConfigs.get(guildID);
    }

    let config = await AutoMod.findOne({guildID});
    if(!config) config = await AutoMod.create({guildID});
    client.autoModConfigs.set(guildID, config);
    return client.autoModConfigs.get(guildID);
}

function toggleBot(client, s) {
    if(!s) client.state = !client.state;
    if(s) client.state = s;

    if(client.state) {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: client.customActivity.name,
                type: client.customActivity.type
            }
        });
    }
    if(!client.state) {
        client.user.setPresence({
            status: 'invisible'
        });
    }
    return client.state;
}

function setActivity(client, type, activity) {
    if(!type) return;
    client.customActivity = {
        name: activity,
        type: type.toUpperCase()
    }
    client.user.setPresence({
        activity: {
            name: client.customActivity.name,
            type: client.customActivity.type
        }
    })
}

const EMBED_LIMITS = {
    title: 256,
    author: 256,
    description: 4096,
    field: {
        amount: 25,
        name: 256,
        value: 1024
    },
    footer: 2048,
}

async function checkEmbedLimits(client, embed, channel, fieldsMax, startingPage) {
    // Title
    if(embed.title && embed.title.length > EMBED_LIMITS.title) embed.setTitle(embed.title.slice(0, EMBED_LIMITS.title-3) + "...");
    
    // Author
    if(embed.author && embed.author.name.length > EMBED_LIMITS.author) embed.setAuthor(
        embed.author.name.slice(0, EMBED_LIMITS.author-3) + "...",
        embed.author.iconURL,
        embed.author.url
    );

    // Description
    if(embed.description && embed.description.length > EMBED_LIMITS.description) embed.setDescription(embed.description.slice(0, EMBED_LIMITS.description-3) + "...");

    // Footer
    if(embed.footer && embed.footer.text.length > EMBED_LIMITS.footer) embed.setFooter(
        embed.footer.text.slice(0, EMBED_LIMITS.footer-3) + "...",
        embed.footer.iconURL
    );

    // TODO: Add checking for total 6k chars limit

    // Fields 
    embed.fields.forEach(field => {
        if(field.name.length > EMBED_LIMITS.field.name) field.name = field.name.slice(0, EMBED_LIMITS.field.name-3) + "...";
        if(field.value.length > EMBED_LIMITS.field.value) field.value = field.value.slice(0, EMBED_LIMITS.field.value-3) + "...";
    });

    if(embed.fields.length <= (fieldsMax || EMBED_LIMITS.field.amount)) return;

    const filter = m => m.author.id === client.user.id
    const collector = channel.createMessageCollector(filter, { time: 5000, max: 1});

    collector.on('collect', async m => {
        collector.stop();

        const fieldsAmount = embed.fields.length;
        const pageAmount = Math.ceil(fieldsAmount / (fieldsMax || EMBED_LIMITS.field.amount));

        let embeds = [embed];

        for (let i = 0; i < pageAmount; i++) {
            const e = new MessageEmbed();

            e.author = embed.author;
            e.title = embed.title;
            e.color = embed.color;
            e.description = embed.description;
            e.footer = embed.footer;
            e.image = embed.image;
            e.thumbnail = embed.thumbnail;
            e.url = embed.url;
            e.fields = embed.fields;
            e.fields = e.fields.slice(i * (fieldsMax || EMBED_LIMITS.field.amount), (i+1) * (fieldsMax || EMBED_LIMITS.field.amount));
            embeds.push(e);
        }

        startingPage = startingPage > pageAmount ? pageAmount : startingPage > 0 ? startingPage : 1;

        // const firstPageButton = new MessageButton()
        //     .setStyle('blurple')
        //     .setEmoji("⏮️")
        //     .setID('firstPage')
        //     .setDisabled();
        
        const previousPageButton = new MessageButton()
            .setStyle('blurple')
            .setEmoji("◀️")
            .setID('previousPage');
        startingPage === 1 && previousPageButton.setDisabled();
        
        const nextPageButton = new MessageButton()
            .setStyle('blurple')
            .setEmoji("▶️")
            .setID('nextPage');
        startingPage === pageAmount && nextPageButton.setDisabled();
        
        // const lastPageButton = new MessageButton()
        //     .setStyle('blurple')
        //     .setEmoji("⏭️")
        //     .setID('lastPage');

        const pageInfoButton = new MessageButton()
            .setStyle('blurple')
            .setLabel(`${startingPage}/${pageAmount}`)
            .setID('pageInfo')
            .setDisabled();

        const buttonsComponent = new MessageActionRow()
            .addComponents([previousPageButton, pageInfoButton, nextPageButton])

        m = await m.edit({embed: embeds[startingPage], component: buttonsComponent});

        handleEmbedPageButtons(m, startingPage, pageAmount, embeds);
    });
    
}

async function handleEmbedPageButtons(msg, currPage, pageAmount, embeds) {
    const buttons = msg.components[0].components;

    const buttonsCollector = msg.createButtonCollector(btn => btn.clicker.user.id === btn.clicker.user.id);

    buttonsCollector.on('collect', async btn => {
        const previousButton = buttons.find(b => b.custom_id === 'previousPage');
        const nextButton = buttons.find(b => b.custom_id === 'nextPage');
        const pageInfoButton = buttons.find(b => b.custom_id === 'pageInfo');

        if(btn.id === 'nextPage') {
            currPage++;
            previousButton.setDisabled(false);
            if(currPage === pageAmount) nextButton.setDisabled(true);
        }

        if(btn.id === 'previousPage') {
            currPage--;
            nextButton.setDisabled(false);
            if(currPage === 1) previousButton.setDisabled(true);
        }

        pageInfoButton.setLabel(`${currPage}/${pageAmount}`)

        const buttonsComponent = new MessageActionRow()
            .addComponents([previousButton, pageInfoButton, nextButton]);
            
        await msg.edit({embed: embeds[currPage],component: buttonsComponent});
        return btn.defer(true);
    })
}



module.exports = {botOwners, palette, convertPerms, JSONToMap, mapToObject, daysInMonth, setGuildConfig, 
    msToTime, setAutoModConfig,
    toggleBot, setActivity,
    checkEmbedLimits};