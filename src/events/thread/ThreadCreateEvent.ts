import { ThreadChannel } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Logs from "../../modules/Logs";

export default class ThreadCreateEvent extends BaseEvent {
    constructor() {
        super('threadCreate');
    }
    
    async run(thread: ThreadChannel) {

        Logs.log('threads', 'create', thread.guildId, { thread })
    }
};