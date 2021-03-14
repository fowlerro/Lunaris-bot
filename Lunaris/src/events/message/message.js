const BaseEvent = require('../../utils/structures/BaseEvent');
const { commandHandle } = require('../../modules/commandHandler');
const { censor } = require('../../modules/autoMod/autoMod');
module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('message');
    }
    
    async run(client, message) {
        if (message.author.bot || message.channel.type === "dm") return;
        commandHandle(client, message);
        censor(client, message.guild.id, message, message.member);

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
