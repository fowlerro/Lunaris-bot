// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete
const { roleDeletedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class RoleDeleteEvent extends BaseEvent {
  constructor() {
    super('roleDelete');
  }
  
  async run(client, role) {
    roleDeletedLog(client, role);
  }
}