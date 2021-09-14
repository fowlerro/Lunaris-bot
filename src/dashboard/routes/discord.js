const {getBotGuilds, getUserGuilds, getGuildRoles} = require('../utils/api');
const router = require('express').Router();
const { getGuilds } = require('../utils/utils');
const Guilds = require('../../modules/Guilds');

router.get('/guilds', async (req, res) => {
    if(req.user) {
        const guilds = await getBotGuilds();
        const userGuilds = await getUserGuilds(req.user.discordId);
        const mutualGuilds = getGuilds(userGuilds, guilds);
        res.send(mutualGuilds);
    } else {
        return res.status(401).send("Unauthorized");
    }
});

router.put('/guilds/:guildId/config', async (req, res) => {
    const { config } = req.body;
    const { guildId } = req.params;
    if(!config) return res.status(400).send("Config required!");
    const update = await Guilds.config.set(global.client, guildId, { prefix: config.prefix, 'modules.autoMod.muteRole': config.muteRole })
    return update ? res.send(update) : res.status(400).send('Could not find document');
});

router.get('/guilds/:guildId/config', async (req, res) => {
    const { guildId } = req.params;
    const config = await Guilds.config.get(global.client, guildId)
    return config ? res.send(config) : res.status(404).send("Not found");
});

router.get('/guilds/:guildId/roles', async (req, res) => {
    const { guildId } = req.params;
    try {
        const roles = await getGuildRoles(guildId);
        res.send(roles);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;