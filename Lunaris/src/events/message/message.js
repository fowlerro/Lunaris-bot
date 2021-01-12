const BaseEvent = require('../../utils/structures/BaseEvent');
const { commandHandle } = require('../../modules/commandHandler');
const { memberJoinedLog } = require('../../modules/guildLogs');

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('message');
    }
    
    async run(client, message) {
        if (message.author.bot || message.channel.type === "dm") return;
        commandHandle(client, message);
    }
};
