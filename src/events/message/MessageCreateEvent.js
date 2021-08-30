const BaseEvent = require('../../utils/structures/BaseEvent');
const CommandHandlerModule = require('../../modules/commandHandler');
const xpSystem = require('../../modules/xpSystem');
const Guilds = require('../../modules/Guilds');
module.exports = class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(client, message) {
        if(message.author.bot) return;
        const guildConfig = await Guilds.config.get(client, message.guild.id);
        const prefix = guildConfig.get('prefix')
        CommandHandlerModule.handleCommand(client, message);
        
        if(!client.isOnline) return;

        if(!message.content.startsWith(prefix)) 
            xpSystem.addTextXp(client, message);

    }
};
