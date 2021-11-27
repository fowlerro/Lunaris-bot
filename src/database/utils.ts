import shortid from 'shortid'
const GuildMembers = require('./schemas/GuildMembers');

export async function generateId(): Promise<string> {
    const id = shortid.generate();
    const result = await GuildMembers.find({ 'warns.id': id });
    if(!result) return generateId();
    return id;
}