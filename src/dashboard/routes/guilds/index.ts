import express from 'express';
import {
	getChannelsController,
	getGuildBansController,
	getGuildPermissionsController,
	getGuildsController,
	getGuildStatisticsController,
	getGuildWarnsController,
	getRolesController,
} from './controllers/index.controller';
import { getAutoRolesController, setAutoRolesController } from './controllers/autoRoles.controller';
import { getServerLogsController, setServerLogsController } from './controllers/serverLogs.controller';
import { getLevelConfigController, setLevelConfigController } from './controllers/levels.controller';
import {
	deleteEmbedMessageController,
	getEmbedMessagesController,
	saveEmbedMessageController,
} from './controllers/embeds.controller';

import { saveEmbedMessagesValidator, deleteEmbedMessageValidator } from './validators/embeds.validators';
import { saveServerLogsValidator } from './validators/serverLogs.validators';

import { isAuthenticated, isAuthorizedInGuild } from '../../utils/middlewares';

const router = express.Router();

router.get('/', isAuthenticated, getGuildsController);

router.get('/:guildId/permissions', isAuthenticated, getGuildPermissionsController);
router.get('/:guildId/stats', isAuthenticated, isAuthorizedInGuild, getGuildStatisticsController);
router.get('/:guildId/roles', isAuthenticated, isAuthorizedInGuild, getRolesController);
router.get('/:guildId/channels', isAuthenticated, isAuthorizedInGuild, getChannelsController);
router.get('/:guildId/bans', isAuthenticated, isAuthorizedInGuild, getGuildBansController);
router.get('/:guildId/warns', isAuthenticated, isAuthorizedInGuild, getGuildWarnsController);

router.get('/:guildId/auto-roles', isAuthenticated, isAuthorizedInGuild, getAutoRolesController);
router.put(
	'/:guildId/auto-roles',
	isAuthenticated,
	isAuthorizedInGuild,
	saveServerLogsValidator,
	setAutoRolesController
);

router.get('/:guildId/server-logs', isAuthenticated, isAuthorizedInGuild, getServerLogsController);
router.put('/:guildId/server-logs', isAuthenticated, isAuthorizedInGuild, setServerLogsController);

router.get('/:guildId/levels', isAuthenticated, isAuthorizedInGuild, getLevelConfigController);
router.put('/:guildId/levels', isAuthenticated, isAuthorizedInGuild, setLevelConfigController);

router.get('/:guildId/embeds', isAuthenticated, isAuthorizedInGuild, getEmbedMessagesController);
router.put(
	'/:guildId/embeds',
	isAuthenticated,
	isAuthorizedInGuild,
	saveEmbedMessagesValidator,
	saveEmbedMessageController
);
router.delete(
	'/:guildId/embeds',
	isAuthenticated,
	isAuthorizedInGuild,
	deleteEmbedMessageValidator,
	deleteEmbedMessageController
);

export default router;
