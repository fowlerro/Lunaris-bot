import { check } from 'express-validator';
import { checkValidationErrors } from '../../../utils/middlewares';

export const saveServerLogsValidator = [
	check('status').isBoolean().withMessage('Invalid status'),
	check('serverLogs.channels.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.channels.logs.create').isBoolean().withMessage('Invalid option'),
	check('serverLogs.channels.logs.delete').isBoolean().withMessage('Invalid option'),
	check('serverLogs.channels.logs.edit').isBoolean().withMessage('Invalid option'),

	check('serverLogs.threads.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.threads.logs.create').isBoolean().withMessage('Invalid option'),
	check('serverLogs.threads.logs.delete').isBoolean().withMessage('Invalid option'),
	check('serverLogs.threads.logs.edit').isBoolean().withMessage('Invalid option'),

	check('serverLogs.emojis.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.emojis.logs.create').isBoolean().withMessage('Invalid option'),
	check('serverLogs.emojis.logs.delete').isBoolean().withMessage('Invalid option'),
	check('serverLogs.emojis.logs.edit').isBoolean().withMessage('Invalid option'),

	check('serverLogs.invites.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.invites.logs.create').isBoolean().withMessage('Invalid option'),
	check('serverLogs.invites.logs.delete').isBoolean().withMessage('Invalid option'),

	check('serverLogs.messages.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.messages.logs.delete').isBoolean().withMessage('Invalid option'),
	check('serverLogs.messages.logs.edit').isBoolean().withMessage('Invalid option'),
	check('serverLogs.messages.logs.purge').isBoolean().withMessage('Invalid option'),
	check('serverLogs.messages.logs.pin').isBoolean().withMessage('Invalid option'),
	check('serverLogs.messages.logs.unpin').isBoolean().withMessage('Invalid option'),

	check('serverLogs.roles.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.roles.logs.create').isBoolean().withMessage('Invalid option'),
	check('serverLogs.roles.logs.delete').isBoolean().withMessage('Invalid option'),
	check('serverLogs.roles.logs.edit').isBoolean().withMessage('Invalid option'),
	check('serverLogs.roles.logs.add').isBoolean().withMessage('Invalid option'),
	check('serverLogs.roles.logs.remove').isBoolean().withMessage('Invalid option'),

	check('serverLogs.members.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.members.logs.join').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.leave').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.kick').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.ban').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.unban').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.warn').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.unwarn').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.unwarnAll').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.timeout').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.timeoutRemove').isBoolean().withMessage('Invalid option'),
	check('serverLogs.members.logs.nicknameChange').isBoolean().withMessage('Invalid option'),

	check('serverLogs.server.channelId')
		.optional()
		.isString()
		.withMessage('channelId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channelId'),
	check('serverLogs.server.logs.unwarnAll').isBoolean().withMessage('Invalid option'),

	checkValidationErrors,
];
