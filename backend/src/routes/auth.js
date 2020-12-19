const router = require('express').Router();
const passport = require('passport');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    res.redirect('http://localhost:3000/');
});

router.get('/discord/invite', (req, res) => {
    res.redirect(`http://localhost:3000/dashboard/${req.query.guild_id}`);
});

router.get('/', (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.status(401).res.send('Unauthorized');
    }
})

module.exports = router;