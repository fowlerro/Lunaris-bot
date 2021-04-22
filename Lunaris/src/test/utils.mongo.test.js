const mongoose = require('mongoose');
const GuildConfig = require('../database/schemas/GuildConfig');
const { setGuildConfig } = require('../utils/utils');
// mongodb://127.0.0.1/testUtils

describe('setGuildConfig test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    });
    
    it('Edycja konfiguracji serwera', async () => {
        const client = {}
        client.guildConfigs = new Map();
        const guildID = '533385524434698260'
        const guildConfig = await GuildConfig.create({
            guildID
        });
        client.guildConfigs.set(guildID, guildConfig)
    
        expect(guildConfig.prefix).toBe('$');
        let config = setGuildConfig(client, guildID, 'prefix', '?');
        expect(typeof config).toBe('object');
        expect(config.get('prefix')).toBe('?');
        expect(config.get('language')).toBe('en');
        config = setGuildConfig(client, guildID, 'language', 'pl');
        expect(config.get('prefix')).toBe('?');
        expect(config.get('language')).toBe('pl');
    }, 20000)
})