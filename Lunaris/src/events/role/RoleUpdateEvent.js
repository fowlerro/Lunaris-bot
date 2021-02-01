// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate
const { roleUpdatedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class RoleUpdateEvent extends BaseEvent {
  constructor() {
    super('roleUpdate');
  }
  
  async run(client, oldRole, newRole) {
    roleUpdatedLog(client, newRole);
  }
}