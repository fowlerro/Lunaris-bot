const fetch = require('node-fetch');
const { decrypt } = require('./utils');
const CryptoJS = require('crypto-js');
const OAuth2Credentials = require('../../database/schemas/OAuth2Credentials');

const API = 'https://discord.com/api/v9';

async function getBotGuilds() {
    const response = await fetch(`${API}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
        }
    });
    return response.json();
};

async function getGuildRoles(guildId) {
    const response = await fetch(`${API}/guilds/${guildId}/roles`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
        }
    });
    return response.json();
};

async function getUserGuilds(discordId) {
    const credentials = await OAuth2Credentials.findOne({ discordId });
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

module.exports = {getBotGuilds, getGuildRoles, getUserGuilds};