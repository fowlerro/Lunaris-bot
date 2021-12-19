import express from 'express'

import { getBotGuilds, getRolesFromGuild, getUserGuilds } from '../utils/api';
import { getGuilds } from '../utils/utils';
import Guilds from '../../modules/Guilds';
import Embeds from '../../modules/Embeds';

const router = express.Router()

router.get('/guilds', async (req, res) => {
    if(req.user) {
        const guilds = await getBotGuilds()
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
    const update = await Guilds.config.set(guildId, { 'modules.autoMod.muteRole': config.muteRole })
    return update ? res.send(update) : res.status(400).send('Could not find document');
});

router.get('/guilds/:guildId/config', async (req, res) => {
    const { guildId } = req.params;
    const config = await Guilds.config.get(guildId)
    return config ? res.send(config) : res.status(404).send("Not found");
});

router.get('/guilds/:guildId/roles', async (req, res) => {
    const { guildId } = req.params;
    try {
        const roles = await getRolesFromGuild(guildId);
        res.send(roles);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

router.put('/guilds/:guildId/embed/send', async (req, res) => {
    const { guildId } = req.params
    const { channelId, embed } = req.body
    if(!channelId || !embed) return res.status(400).send({ "msg": "ChannelId required" })
    return Embeds.send(embed, guildId, channelId)
})

export default router