import * as dotenv from 'dotenv'
dotenv.config()

import { Intents } from 'discord.js'
import i18n, { __ } from 'i18n'

import DiscordClient from './types/client'
import { connectDatabase } from './database/mongoose'
import { registerCommands, registerEvents, registerModules } from './utils/registry'
import dashboard from './dashboard/app'
import i18nconfig, { translate } from './utils/i18n'

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

i18n.configure(i18nconfig);

declare global {
  	var client: DiscordClient;
	var t: typeof translate;
}
global.client = client;
global.t = translate;

(async () => {
	await connectDatabase();
	
	await registerEvents('../events');
	await client.login(process.env.DISCORD_CLIENT_TOKEN);
	await registerCommands('../commands');
	await registerModules('../modules');
	client.isOnline = true

	dashboard()
})();