const reactionRoles = require('../../modules/reactionRoles');
const { registerPresence } = require('../../utils/registry');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client) {
    console.log(client.user.tag + ' has logged in.');
    reactionRoles.fetchMessages(client);
    await registerPresence(client);
    }
}