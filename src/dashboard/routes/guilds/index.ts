import express from 'express';
import {
	getGuildBansController,
	getGuildPermissionsController,
	getGuildsController,
	getGuildStatisticsController,
	getGuildWarnsController,
	getRolesController,
} from './controllers/index.controller';
import { getAutoRolesController, setAutoRolesController } from './controllers/autoRoles.controller';

import { isAuthenticated, isAuthorizedInGuild } from '../../utils/middlewares';

const router = express.Router();

router.get('/', isAuthenticated, getGuildsController);

router.get('/:guildId/permissions', isAuthenticated, getGuildPermissionsController);
router.get('/:guildId/stats', isAuthenticated, isAuthorizedInGuild, getGuildStatisticsController);
router.get('/:guildId/roles', isAuthenticated, isAuthorizedInGuild, getRolesController);
router.get('/:guildId/bans', isAuthenticated, isAuthorizedInGuild, getGuildBansController);
router.get('/:guildId/warns', isAuthenticated, isAuthorizedInGuild, getGuildWarnsController);

router.get('/:guildId/auto-roles', isAuthenticated, isAuthorizedInGuild, getAutoRolesController);
router.put('/:guildId/auto-roles', isAuthenticated, isAuthorizedInGuild, setAutoRolesController);

export default router;
