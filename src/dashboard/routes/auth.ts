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

router.get('/', (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.status(401).send('Unauthorized');
    }
})

export default router