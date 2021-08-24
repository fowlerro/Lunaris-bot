const BaseEvent = require('../../utils/structures/BaseEvent');
const CommandHandlerModule = require('../../modules/commandHandler');
const xpSystem = require('../../modules/xpSystem');
module.exports = class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(client, message) {
        if(message.author.bot) return;
        const guildConfig = client.guildConfigs.get(message.guild.id);
        const prefix = guildConfig.get('prefix')
        CommandHandlerModule.handleCommand(client, message);
        
        if(!client.isOnline) return;

        if(!message.content.startsWith(prefix)) 
            xpSystem.addTextXp(client, message);

    }
};
