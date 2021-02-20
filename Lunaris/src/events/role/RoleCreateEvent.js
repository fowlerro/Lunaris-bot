// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleCreate
const { roleCreatedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class RoleCreateEvent extends BaseEvent {
  constructor() {
    super('roleCreate');
  }
  
  async run(client, role) {
    roleCreatedLog(client, role);
  }
}