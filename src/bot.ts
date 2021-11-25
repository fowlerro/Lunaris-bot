import * as dotenv from 'dotenv'
dotenv.config()

import { Intents, Collection } from 'discord.js'
import DiscordClient from './types/client';
const client = new DiscordClient({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_INVITES]});
import { connectDatabase } from './database/mongoose'
// const { registerCommands, registerEvents, registerModules } = require('./utils/registry');
import { registerCommands, registerEvents } from './utils/registry'
// const dashboard = require('./dashboard/app');
declare global {
  var client: DiscordClient;
}
global.client = client;

(async () => {
  await connectDatabase();
  
  await registerCommands('../commands');
  await registerEvents('../events');
  await client.login(process.env.DISCORD_CLIENT_TOKEN);
  // await registerModules(client, '../modules');

  // dashboard(client)
})();