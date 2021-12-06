import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Guilds from "../../modules/Guilds";
import xpSystem from "../../modules/xpSystem";

export default class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(message: Message) {
        if(message.author.bot) return;
        if(!message.guild) return
        const guildConfig = await Guilds.config.get(message.guild.id);
        if(!guildConfig) return
        const prefix = guildConfig.prefix
        // CommandHandlerModule.handleCommand(client, message);

        if(message.content.startsWith('!test')) {
        }
        
        if(!client.isOnline) return;

        if(!message.content.startsWith(prefix)) 
            xpSystem.addTextXp(message);

    }
};