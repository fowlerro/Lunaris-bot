import BaseEvent from "../../utils/structures/BaseEvent";

const reactionRoles = require('../../modules/reactionRoles');
const { registerPresence } = require('../../utils/registry');

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run () {
    console.log(client.user?.tag + ' has logged in.');
    reactionRoles.fetchMessages(client);
    // await registerPresence(client); //TODO
    }
}