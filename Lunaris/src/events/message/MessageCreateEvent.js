const BaseEvent = require('../../utils/structures/BaseEvent');
const CommandHandlerModule = require('../../modules/commandHandler');
const xpSystem = require('../../modules/xpSystem');
// const { censor } = require('../../modules/autoMod/autoMod');
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
        // censor(client, message.guild.id, message, message.member);

        if(!message.content.startsWith(prefix)) 
            xpSystem.addTextXp(client, message);

    }
};
