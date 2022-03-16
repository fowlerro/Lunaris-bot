import express from 'express';
import {
	getGuildBansController,
	getGuildPermissionsController,
	getGuildsController,
	getGuildStatisticsController,
	getGuildWarnsController,
} from './index.controller';
import { isAuthenticated } from '../../utils/middlewares';

const router = express.Router();

router.get('/', isAuthenticated, getGuildsController);

router.get('/:guildId/permissions', isAuthenticated, getGuildPermissionsController);
router.get('/:guildId/stats', isAuthenticated, getGuildStatisticsController);
router.get('/:guildId/bans', isAuthenticated, getGuildBansController);
router.get('/:guildId/warns', isAuthenticated, getGuildWarnsController);

export default router;
