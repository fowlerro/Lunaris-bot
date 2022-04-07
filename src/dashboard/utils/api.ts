import fetch from 'node-fetch';
import { Snowflake } from 'discord.js';
import { APIChannel, APIRole } from 'discord.js/node_modules/discord-api-types';

const API = 'https://discord.com/api/v9';

export async function getRolesFromGuild(guildId: Snowflake): Promise<APIRole[]> {
	const response = await fetch(`${API}/guilds/${guildId}/roles`, {
		method: 'GET',
		headers: {
			Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
		},
	});
	return response.json() as Promise<APIRole[]>;
}

export async function getChannelsFromGuild(guildId: Snowflake): Promise<APIChannel[]> {
	const response = await fetch(`${API}/guilds/${guildId}/channels`, {
		method: 'GET',
		headers: {
			Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
		},
	});
	return response.json() as Promise<APIChannel[]>;
}
