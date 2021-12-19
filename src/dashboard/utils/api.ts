import fetch from "node-fetch";
import CryptoJS from 'crypto-js'
import { Snowflake } from "discord.js";
import { APIChannel, APIGuild, APIRole } from "discord.js/node_modules/discord-api-types";

import { OAuth2CredentialsModel } from "../../database/schemas/OAuth2Credentials";
import { decrypt } from "./utils";

const API = 'https://discord.com/api/v9';

export async function getBotGuilds(): Promise<APIGuild[]> {
    const response = await fetch(`${API}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
        }
    });
    return response.json();
};

export async function getRolesFromGuild(guildId: Snowflake): Promise<APIRole[]> {
    const response = await fetch(`${API}/guilds/${guildId}/roles`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
        }
    });
    return response.json();
};

export async function getChannelsFromGuild(guildId: Snowflake): Promise<APIChannel[]> {
    const response = await fetch(`${API}/guilds/${guildId}/channels`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
        }
    });
    return response.json()
};

export async function getUserGuilds(discordId: Snowflake): Promise<APIGuild[]> {
    const credentials = await OAuth2CredentialsModel.findOne({ discordId });
    if(!credentials) throw new Error("No credentials.");
    const encryptedAccessToken = credentials.get('accessToken');
    const decrypted = decrypt(encryptedAccessToken);
    const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
    const response = await fetch(`${API}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.json();
}