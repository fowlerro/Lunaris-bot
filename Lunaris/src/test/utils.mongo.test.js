const mongoose = require('mongoose');
const AutoMod = require('../database/schemas/AutoMod');
const GuildConfig = require('../database/schemas/GuildConfig');
const { setGuildConfig, setAutoModConfig } = require('../utils/utils');
// mongodb://127.0.0.1/testUtils

const deleteAfterRun = true

describe('setGuildConfig test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    });
    
    afterEach(() => {
        mongoose.connection.db.dropDatabase();
    });

    // function setGuildConfig();
    
    it('Edycja konfiguracji serwera', async () => {
        const client = {}
        client.guildConfigs = new Map();
        const guildID = '533385524434698260'
        const guildConfig = await GuildConfig.create({
            guildID
        });
        client.guildConfigs.set(guildID, guildConfig);

        expect(guildConfig.get('prefix')).toBe('$');
        let config = await setGuildConfig(client, guildID, 'prefix', '?');
        expect(typeof config).toBe('object');
        expect(config.get('prefix')).toBe('?');
        expect(config.get('language')).toBe('en');
        config = await setGuildConfig(client, guildID, 'language', 'pl');
        expect(config.get('prefix')).toBe('?');
        expect(config.get('language')).toBe('pl');
    }, 20000);

    // function setAutoModConfig();

    it('Dodawanie słów do cenzury autoMod', async () => {
        const client = {}
        client.autoModConfigs = new Map();
        const guildID = '533385524434698260'
        const autoModConfig = await AutoMod.create({
            guildID
        });
        client.autoModConfigs.set(guildID, autoModConfig);

        expect(autoModConfig.get('censor.triggerValue')).toBe(3);
        let config = await setAutoModConfig(client, guildID, 'add', 'censor.words', ['bitch', 'fuck you']);
        expect(typeof config).toBe('object');
        expect(config.get('censor.triggerValue')).toBe(3);
        expect(config.get('censor.words')).toContain('bitch');
        expect(config.get('censor.words')).toContain('fuck you');
    }, 20000);

    it('Usuwanie słów z cenzury autoMod', async () => {
        const client = {}
        client.autoModConfigs = new Map();
        const guildID = '533385524434698260'
        const autoModConfig = await AutoMod.create({
            guildID,
            censor: {
                words: ['bitch', 'fuck you']
            }
        });
        client.autoModConfigs.set(guildID, autoModConfig);

        expect(autoModConfig.get('censor.words')).toContain('bitch');
        expect(autoModConfig.get('censor.words')).toContain('fuck you');
        config = await setAutoModConfig(client, guildID, 'remove', 'censor.words', ['bitch']);
        expect(typeof config).toBe('object');
        expect(config.get('censor.words')).not.toContain('bitch');
        expect(config.get('censor.words')).toContain('fuck you');
    }, 20000)

    it('Dodawanie/usuwanie cenzury bez danych w bazie', async () => {
        const client = {}
        client.autoModConfigs = new Map();
        const guildID = '533385524434698260';

        let config = await setAutoModConfig(client, guildID, 'add', 'censor.words', ['bitch', 'fuck you']);
        expect(typeof config).toBe('object');
        expect(config.get('censor.triggerValue')).toBe(3);
        expect(config.get('censor.words')).toContain('bitch');
        expect(config.get('censor.words')).toContain('fuck you');

        config = await setAutoModConfig(client, guildID, 'remove', 'censor.words', ['bitch']);
        expect(config.get('censor.triggerValue')).toBe(3);
        expect(config.get('censor.words')).not.toContain('bitch');
        expect(config.get('censor.words')).toContain('fuck you');
    }, 20000)
})