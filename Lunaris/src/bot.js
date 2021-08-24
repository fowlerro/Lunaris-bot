require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const { connectDatabase } = require('./database/mongoose');
const { registerCommands, registerEvents, registerGuildConfigs, registerModules } = require('./utils/registry');


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
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();