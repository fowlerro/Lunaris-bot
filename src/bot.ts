import * as dotenv from 'dotenv'
dotenv.config()

import { Intents } from 'discord.js'

import DiscordClient from './types/client'
import { connectDatabase } from './database/mongoose'
import { registerCommands, registerEvents, registerModules } from './utils/registry'
import dashboard from './dashboard/app'

export const testGuildId = '533385524434698260'

const client = new DiscordClient({ 
  	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES, 
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
		Intents.FLAGS.GUILD_VOICE_STATES, 
		Intents.FLAGS.GUILD_INVITES
	]
});

declare global {
  	var client: DiscordClient;
}
global.client = client;

(async () => {
	await connectDatabase();
	
	await registerEvents('../events');
	await client.login(process.env.DISCORD_CLIENT_TOKEN);
	await registerCommands('../commands');
	await registerModules('../modules');
	client.isOnline = true

	dashboard()
})();