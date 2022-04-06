import { check } from 'express-validator';
import { checkValidationErrors } from '../../../utils/middlewares';

export const setLevelConfigValidator = [
	check('status').isBoolean().withMessage('Invalid status'),
	check('levelConfig.multiplier')
		.isFloat({ min: 0, max: 5 })
		.withMessage('Multiplier must a number be between 0 and 5'),

	check('levelConfig.levelUpMessage.channelId')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Channel ID must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Channel ID must be 18 characters long'),
	check('levelConfig.levelUpMessage.mode')
		.isString()
		.withMessage('Mode must be a string')
		.isIn(['off', 'currentChannel', 'specificChannel'])
		.withMessage('Mode must be one of off, currentChannel, specificChannel'),
	check('levelConfig.levelUpMessage.messageFormat')
		.optional()
		.isString()
		.withMessage('Message format must be a string')
		.isLength({ max: 256 })
		.withMessage('Message format must be less than 256 characters long'),

	check('levelConfig.rewards.text')
		.isArray({ max: 20 })
		.withMessage('Text rewards must be an array of length 20 or less'),
	check('levelConfig.rewards.text.*._id').optional().isMongoId().withMessage('Role ID must be a valid Mongo ID'),
	check('levelConfig.rewards.text.*.level')
		.isInt({ min: 1, max: 200 })
		.withMessage('Level must be an integer between 1 and 200'),
	check('levelConfig.rewards.text.*.roleId')
		.isString()
		.withMessage('Role ID must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Role ID must be 18 characters long'),
	check('levelConfig.rewards.text.*.takePreviousRole').isBoolean().withMessage('Take previous role must be a boolean'),

	check('levelConfig.rewards.voice')
		.isArray({ max: 20 })
		.withMessage('Text rewards must be an array of length 20 or less'),
	check('levelConfig.rewards.voice.*._id').optional().isMongoId().withMessage('Role ID must be a valid Mongo ID'),
	check('levelConfig.rewards.voice.*.level')
		.isInt({ min: 1, max: 200 })
		.withMessage('Level must be an integer between 1 and 200'),
	check('levelConfig.rewards.voice.*.roleId')
		.isString()
		.withMessage('Role ID must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Role ID must be 18 characters long'),
	check('levelConfig.rewards.voice.*.takePreviousRole').isBoolean().withMessage('Take previous role must be a boolean'),

	checkValidationErrors,
];
