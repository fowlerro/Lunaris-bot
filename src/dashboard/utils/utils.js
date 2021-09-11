const CryptoJS = require('crypto-js');

function getGuilds(userGuilds, botGuilds) {
    const validGuilds = userGuilds.filter(guild => (guild.permissions & 0x20) === 0x20);
    const included = [];
    const excluded = validGuilds.filter(userGuild => {
        const findGuild = botGuilds.find(botGuild => botGuild.id === userGuild.id);
        if(!findGuild) return userGuild;
        included.push(findGuild);
    });
    
    return {excluded, included};
}

function encrypt(token) {
    return CryptoJS.AES.encrypt(token, process.env.ENCRYPT_KEY);
}

function decrypt(token) {
    return CryptoJS.AES.decrypt(token, process.env.ENCRYPT_KEY);
}



module.exports = {getGuilds, encrypt, decrypt};