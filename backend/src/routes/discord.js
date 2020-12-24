const {getBotGuilds, getUserGuilds, getGuildRoles} = require('../utils/api');
const router = require('express').Router();
const User = require('../database/schemas/User');
const GuildConfig = require('../database/schemas/GuildConfig');
const {getMutualGuilds} = require('../utils/utils');

router.get('/guilds', async (req, res) => {
    const guilds = await getBotGuilds();
    // const user = await User.findOne({discordID: req.user.discordID});
    if(req.user) {
        const userGuilds = await getUserGuilds(req.user.discordID);
        const mutualGuilds = getMutualGuilds(userGuilds, guilds);
        res.send(mutualGuilds);
    } else {
        return res.status(401).send("Unauthorized");
    }
});

router.put('/guilds/:guildID/config', async (req, res) => {
    const {config} = req.body;
    const {guildID} = req.params;
    if(!config) return res.status(400).send("Config required!");
    const update = await GuildConfig.findOneAndUpdate({guildID}, {
        prefix: config.prefix,
    }, {new: true});
    return update ? res.send(update) : res.status(400).send('Could not find document');
});

router.get('/guilds/:guildID/config', async (req, res) => {
    const {guildID} = req.params;
    const config = await GuildConfig.findOne({guildID});
    return config ? res.send(config) : res.status(404).send("Not found"); 
});

router.get('/guilds/:guildID/roles', async (req, res) => {
    const {guildID} = req.params;
    try {
        const roles = await getGuildRoles(guildID);
        res.send(roles);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;