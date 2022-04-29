import express from 'express';
import auth from './auth';
import guilds from './guilds';
import profile from './profile';
import emojis from './emojis';

const router = express.Router();

router.use('/auth', auth);
router.use('/guilds', guilds);
router.use('/profile', profile);
router.use('/emojis', emojis);

export default router;
