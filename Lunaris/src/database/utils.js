const shortid = require('shortid');
const GuildMembers = require('./schemas/GuildMembers');

async function generateId() {
    const id = shortid.generate();
    const result = await GuildMembers.find({'warns.id': id});
    if(!result) return generateId();
    return id;
}

module.exports = {generateId};