require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES]});
const { connectDatabase } = require('./database/mongoose');
const { registerCommands, registerEvents, registerModules } = require('./utils/registry');
const dashboard = require('./dashboard/app');

(async () => {
  await connectDatabase();

  client.isOnline = true;
  client.commands = new Collection();
  client.events = new Map();
  client.modules = new Map();
  client.guildConfigs = new Map();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await registerModules(client, '../modules');
  await client.login(process.env.DISCORD_CLIENT_TOKEN);

  dashboard(client)
})();