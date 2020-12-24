import axios from 'axios';

export function getUserDetails() {
    return axios.get('http://localhost:3001/api/auth', {
        withCredentials: true
    });
}

export function getGuilds() {
    return axios.get('http://localhost:3001/api/discord/guilds', {
        withCredentials: true
    });
}

export function getGuildConfig(guildID) {
    return axios.get(`http://localhost:3001/api/discord/guilds/${guildID}/config`, {
        withCredentials: true
    });
}

export function updateGuildConfig(guildID, config) {
    return axios.put(`http://localhost:3001/api/discord/guilds/${guildID}/config`, {
        config
    }, {
        withCredentials: true
    })
}

export function getGuildRoles(guildID) {
    return axios.get(`http://localhost:3001/api/discord/guilds/${guildID}/roles`, {
        withCredentials: true
    });
}