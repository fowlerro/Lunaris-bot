import './moduleAliases';
import * as dotenv from 'dotenv';
dotenv.config();

import { Intents } from 'discord.js';
import i18n from 'i18n';

import DiscordClient from './typings/client';
import { connectDatabase } from './database/mongoose';
import { registerEvents } from './utils/registry';
import dashboard from './dashboard/app';
import i18nconfig, { translate } from './utils/i18n';
import cache, { Cache } from './utils/cache';
import Logger from './utils/Logger';

const client = new DiscordClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	],
});

i18n.configure(i18nconfig);

declare global {
	var client: DiscordClient;
	var cache: Cache;
	var t: typeof translate;
	var logger: typeof Logger;
}
global.client = client;
global.cache = cache;
global.t = translate;
global.logger = Logger;

(async () => {
	await connectDatabase();

	await registerEvents('../events');
	await client.login(process.env.DISCORD_CLIENT_TOKEN);

	dashboard();
})();
