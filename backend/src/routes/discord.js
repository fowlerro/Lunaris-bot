const getBotGuilds = require('../utils/api');
const router = require('express').Router();
const User = require('../database/schemas/User');
const getMutualGuilds = require('../utils/utils');

router.get('/guilds', async (req, res) => {
    const guilds = await getBotGuilds();
    const user = await User.findOne({discordID: req.user.discordID}); // ! if(req.user)
    if(user) {
        const userGuilds = user.get('guilds');
        const mutualGuilds = getMutualGuilds(userGuilds, guilds);
        res.send(mutualGuilds);
    } else {
        return res.status(401).send("Unauthorized");
    }
});

module.exports = router;