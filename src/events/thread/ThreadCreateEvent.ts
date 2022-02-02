import { ThreadChannel } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class ThreadCreateEvent extends BaseEvent {
    constructor() {
        super('threadCreate');
    }
    
    async run(thread: ThreadChannel) {

        Logs.log('threads', 'create', thread.guildId, { thread })
    }
};