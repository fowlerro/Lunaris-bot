import { check } from 'express-validator';
import { checkValidationErrors } from '../../../utils/middlewares';
import { INTERACTIVE_ROLE_ACTIONS, INTERACTIVE_ROLE_STYLES, INTERACTIVE_ROLE_TYPES } from '@modules/InteractiveRoles';

export const saveInteractiveRolesValidator = [
	check('name')
		.notEmpty()
		.withMessage('Name is required')
		.isString()
		.withMessage('Name must be a string')
		.isLength({ max: 32 })
		.withMessage('Name must be less than or equal 32 characters'),
	check('type')
		.isString()
		.withMessage('Type must be a string')
		.isIn(INTERACTIVE_ROLE_TYPES)
		.withMessage('Invalid type'),
	check('channelId')
		.isString()
		.withMessage('Channel id must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channel id'),
	check('messageId')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Message id must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid message id'),
	check('embedId').optional({ checkFalsy: true }).isMongoId().withMessage('embedId must be a MongoDB Id'),
	check('placeholder')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Placeholder must be a string')
		.isLength({ max: 150 })
		.withMessage('Placeholder must be less or equal 150 characters'),
	check('roles').isArray({ min: 1, max: 25 }).withMessage('Roles must be an array with min. 1 and max. 25 items'),
	check('roles.*.icon')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Icon must be a string')
		.isLength({ max: 80 })
		.withMessage(`Invalid icon`),
	check('roles.*.label')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Label must be a string')
		.isLength({ max: 80 })
		.withMessage(`Label must be less or equal 80 characters`),
	check('roles.*.description')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Description must be a string')
		.isLength({ max: 100 })
		.withMessage('Description must be less or equal 100 characters'),
	check('roles.*.style')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Style must be a string')
		.isIn(INTERACTIVE_ROLE_STYLES)
		.withMessage('Invalid style'),
	check('roles.*.roleId')
		.notEmpty()
		.withMessage('roleId is required')
		.isString()
		.withMessage('roleId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid roleId'),
	check('roles.*.action')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Action must be a string')
		.isIn(INTERACTIVE_ROLE_ACTIONS)
		.withMessage('Invalid action'),
	check('withoutSending').optional().isBoolean(),
	checkValidationErrors,
];

export const deleteInteractiveRoleValidator = [
	check('interactiveRoleId').isMongoId().withMessage('Invalid interactiveRoleId'),
	checkValidationErrors,
];
