import shortid from 'shortid'
import { GuildProfileModel } from './schemas/GuildProfile';

export async function generateId(): Promise<string> {
    const id = shortid.generate();
    const result = await GuildProfileModel.find({ 'warns.id': id });
    if(!result) return generateId();
    return id;
}