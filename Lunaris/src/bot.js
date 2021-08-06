require('dotenv').config();
const { Client } = require('discord.js');
const { registerCommands, registerEvents, registerMessagesCount, registerGuildConfigs, registerAutoModConfigs, registerMutes, registerTerminalCommands } = require('./utils/registry');
const { mapToObject } = require('./utils/utils');
const client = new Client();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { checkAutoRoles } = require('./modules/autoRole');
require('discord-buttons')(client);
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

(async () => {
  client.state = true;
  client.commands = new Map();
  client.events = new Map();
  client.guildConfigs = new Map();
  client.autoModConfigs = new Map();
  client.autoModUsers = new Map();
  client.msgCount = new Map();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await registerGuildConfigs(client);
  await registerAutoModConfigs(client);
  await registerMessagesCount(client);
  await registerTerminalCommands(client);
  await client.login(process.env.DISCORD_BOT_TOKEN);
  await checkAutoRoles(client);
  await registerMutes(client);
})();

function handle(signal) {
  let data = JSON.stringify(mapToObject(client.msgCount));
  const pathFile = path.join(__dirname, './database/statistics.json');
  fs.writeFileSync(pathFile, data);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);