require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Intents } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const { connectDatabase } = require('./database/mongoose');
const { registerCommands, registerEvents, registerMessagesCount, registerGuildConfigs, registerTerminalCommands, registerPresence, registerModules } = require('./utils/registry');
const { mapToObject } = require('./utils/utils');
const { checkAutoRoles } = require('./modules/autoRole');


(async () => {
  connectDatabase();

  client.isOnline = true;
  client.commands = new Map();
  client.events = new Map();
  client.modules = new Map();
  client.guildConfigs = new Map();
  // client.autoModConfigs = new Map();
  // client.autoModUsers = new Map();
  client.msgCount = new Map();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await registerModules(client, '../modules');
  await registerGuildConfigs(client);
  await registerMessagesCount(client);
  await registerTerminalCommands(client);
  await client.login(process.env.DISCORD_BOT_TOKEN);
  await registerPresence(client);
  await checkAutoRoles(client);
})();

function handle(signal) {
  let data = JSON.stringify(mapToObject(client.msgCount));
  const pathFile = path.join(__dirname, './database/statistics.json');
  fs.writeFileSync(pathFile, data);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);