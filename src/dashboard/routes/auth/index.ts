import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../../utils/middlewares';
import { getAuthController } from './index.controller';

const router = express.Router();

router.get('/discord', passport.authenticate('discord'), (req, res) => res.sendStatus(200));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
	res.redirect(`${process.env.FRONTEND_DOMAIN}/dashboard`);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect(process.env.FRONTEND_DOMAIN!);
});

router.get('/', isAuthenticated, getAuthController);

export default router;
