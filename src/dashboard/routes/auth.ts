import express from 'express'
import passport from 'passport';

const router = express.Router()

router.get('/discord', passport.authenticate('discord'));

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('http://localhost:3000/')
})

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    res.redirect('http://localhost:3000/servers');
});

router.get('/discord/invite/redirect', (req, res) => {
    res.redirect(`http://localhost:3000/dashboard/${req.query.guild_id}`);
})

router.get('/discord/invite', (req, res) => {
    res.redirect('https://discord.com/api/oauth2/authorize?client_id=739412828737372181&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fdiscord%2Finvite%2Fredirect&response_type=code&scope=bot%20guilds.join')
});

router.get('/discord/invite/:id', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=739412828737372181&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fdiscord%2Finvite%2Fredirect&response_type=code&scope=bot%20guilds.join&guild_id=${req.params.id}`)
});

router.get('/', (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.status(401).send('Unauthorized');
    }
})

export default router