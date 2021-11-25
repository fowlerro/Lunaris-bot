import { Message } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";

const CommandHandlerModule = require('../../modules/commandHandler');
const xpSystem = require('../../modules/xpSystem');
const Guilds = require('../../modules/Guilds');

export default class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(message: Message) {
        if(message.author.bot) return;
        if(!message.guild) return
        const guildConfig = await Guilds.config.get(client, message.guild.id);
        const prefix = guildConfig.get('prefix')
        CommandHandlerModule.handleCommand(client, message);
        
        if(!client.isOnline) return;

        if(!message.content.startsWith(prefix)) 
            xpSystem.addTextXp(client, message);

    }
};