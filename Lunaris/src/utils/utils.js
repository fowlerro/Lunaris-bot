const AutoMod = require("../database/schemas/AutoMod");
const GuildConfig = require("../database/schemas/GuildConfig");
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
    let ERROR = null;

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

    // Fields 
    embed.fields.forEach(field => {
        if(field.name.length > EMBED_LIMITS.field.name) field.name = field.name.slice(0, EMBED_LIMITS.field.name-3) + "...";
        if(field.value.length > EMBED_LIMITS.field.value) field.value = field.value.slice(0, EMBED_LIMITS.field.value-3) + "...";
    });

    if(embed.fields.length <= (fieldsMax || EMBED_LIMITS.field.amount)) return;

    const filter = m => m.author.id === client.user.id
    const collector = channel.createMessageCollector({ filter, time: 5000, max: 1 });

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

            if(checkEmbedSumCharactersLimit(e)) {
                ERROR = "Embed exceeds 6000 characters";
                break;
            }
            embeds.push(e);
        }

        if(ERROR) {
            await m.edit(ERROR);
            return ERROR;
        }

        startingPage = startingPage > pageAmount ? pageAmount : startingPage > 0 ? startingPage : 1;

        // const firstPageButton = new MessageButton()
        //     .setStyle('blurple')
        //     .setEmoji("⏮️")
        //     .setID('firstPage')
        //     .setDisabled();
        
        const previousPageButton = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji("◀️")
            .setCustomId('previousPage');
        startingPage === 1 && previousPageButton.setDisabled();
        
        const nextPageButton = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji("▶️")
            .setCustomId('nextPage');
        startingPage === pageAmount && nextPageButton.setDisabled();
        
        // const lastPageButton = new MessageButton()
        //     .setStyle('blurple')
        //     .setEmoji("⏭️")
        //     .setID('lastPage');

        const pageInfoButton = new MessageButton()
            .setStyle('PRIMARY')
            .setLabel(`${startingPage}/${pageAmount}`)
            .setCustomId('pageInfo')
            .setDisabled();

        const buttonsComponent = new MessageActionRow()
            .addComponents([previousPageButton, pageInfoButton, nextPageButton])

        m = await m.edit({embeds: [embeds[startingPage]], components: [buttonsComponent]});

        handleEmbedPageButtons(m, startingPage, pageAmount, embeds);
    });
    
}

function checkEmbedSumCharactersLimit(embed) {
    let total = 0;

    total += (embed.title?.length || 0) + (embed.description?.length || 0) + (embed.author?.name.length || 0) + (embed.footer?.text.length || 0);

    embed.fields.forEach(field => {
        total += field.name.length + field.value.length;
    })

    if(total > 6000) return true;
    return false;
}

async function handleEmbedPageButtons(msg, currPage, pageAmount, embeds) {
    const buttons = msg.components[0].components;

    const filter = (interaction) => interaction.user.id === interaction.user.id;
    const buttonsCollector = msg.createMessageComponentCollector({filter, time: 60000});

    buttonsCollector.on('collect', async btn => {
        const previousButton = buttons.find(b => b.customId === 'previousPage');
        const nextButton = buttons.find(b => b.customId === 'nextPage');
        const pageInfoButton = buttons.find(b => b.customId === 'pageInfo');

        if(btn.customId === 'nextPage') {
            currPage++;
            previousButton.setDisabled(false);
            if(currPage === pageAmount) nextButton.setDisabled(true);
        }

        if(btn.customId === 'previousPage') {
            currPage--;
            nextButton.setDisabled(false);
            if(currPage === 1) previousButton.setDisabled(true);
        }

        pageInfoButton.setLabel(`${currPage}/${pageAmount}`)

        const buttonsComponent = new MessageActionRow()
            .addComponents([previousButton, pageInfoButton, nextButton]);
            
        await msg.edit({embeds: [embeds[currPage]], components: [buttonsComponent]});
        return btn.deferUpdate();
    })
}



module.exports = {botOwners, palette, JSONToMap, mapToObject, daysInMonth, setGuildConfig, 
    msToTime, setAutoModConfig,
    toggleBot, setActivity,
    checkEmbedLimits};