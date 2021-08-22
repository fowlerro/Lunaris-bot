const BaseEvent = require('../../utils/structures/BaseEvent');
const { commandHandle } = require('../../modules/commandHandler/commandHandler');
const { addXpText } = require('../../modules/xpSystem/text');
// const { censor } = require('../../modules/autoMod/autoMod');
module.exports = class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(client, message) {
        if(message.author.bot) return;
        // if(message.channel.type === "dm") return console.log(`DM > ${message.author.tag}: ${message.content}`)
        const guildConfig = client.guildConfigs.get(message.guild.id);
        const prefix = guildConfig.get('prefix');
        commandHandle(client, message);
        
        if(!client.isOnline) return;
        // censor(client, message.guild.id, message, message.member);

        if(!message.content.startsWith(prefix)) 
            addXpText(client, message);

        const count = client.msgCount.get(message.guild.id);
        const date = new Date();
        let day = date.getDate();
        if(day < 10) day = `0${day}`;
        let month = date.getMonth()+1;
        if(month < 10) month = `0${month}`;
        const currDay = `${day}${month}`;
        if(count) {
            if(count[currDay]) {
                const counter = client.msgCount.get(message.guild.id);
                client.msgCount.set(message.guild.id, {
                    ...client.msgCount.get(message.guild.id),
                    [currDay]: counter[currDay]+1
                })
            } else {
                client.msgCount.set(message.guild.id, {
                    ...client.msgCount.get(message.guild.id),
                    [currDay]: 1
                })
            }
        } else {
            client.msgCount.set(message.guild.id, {
                ...client.msgCount.get(message.guild.id),
                [currDay]: 1
            });
        }
    }
};
