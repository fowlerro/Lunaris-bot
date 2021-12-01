import BaseEvent from "../../utils/structures/BaseEvent";
import { registerPresence } from "../../utils/registry";
import reactionRoles from "../../modules/reactionRoles";

// const reactionRoles = require('../../modules/reactionRoles');

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run() {
    console.log(client.user?.tag + ' has logged in.');
    // reactionRoles.fetchMessages(client);
    await reactionRoles.fetchMessages()
    await registerPresence();
    }
}