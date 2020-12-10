const fetch = require('node-fetch');

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

module.exports = getBotGuilds;