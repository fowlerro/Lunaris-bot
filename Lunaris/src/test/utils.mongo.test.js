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
        const client = {};
        const guildID = '533385524434698260'
        const guildConfig = await GuildConfig.create({
            guildID: '533385524434698260'
        });
        // client.guildConfigs.set(guildID, {prefix: guildConfig.get('prefix'), language: guildConfig.get('language')})
    
        // let config = setGuildConfig(client, guildID, 'prefix', '?');
        // console.log(config);
        // expect(typeof config).toBe('object');
        // expect(config.prefix).toBe('?');
        // expect(config.language).toBe('en');
        // config = setGuildConfig(client, guildID, 'language', 'pl');
        // expect(config.prefix).toBe('?');
        // expect(config.language).toBe('pl');
    }, 20000)
})