const fetch = require('node-fetch');
const OAuth2Credentials = require('../database/schemas/OAuth2Credentials');
const { decrypt } = require('./utils');
const CryptoJS = require('crypto-js');

const API = 'https://discord.com/api/v8';

async function getBotGuilds() {
    const response = await fetch(`${API}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
    });
    return response.json();
}

async function getUserGuilds(discordID) {
    const credentials = await OAuth2Credentials.findOne({discordID});
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

module.exports = {getBotGuilds, getUserGuilds};