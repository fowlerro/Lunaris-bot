import { check } from 'express-validator';
import { checkValidationErrors } from '../../../utils/middlewares';

export const setAutoRolesValidator = [
	check('status').isBoolean().withMessage('Invalid status'),
	check('autoRoles').isArray({ max: 5 }).withMessage('autoRoles must be an array of 5 elements'),
	check('autoRoles.*.roleId')
		.trim()
		.isString()
		.withMessage('roleId must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('invalid roleId'),
	check('autoRoles.*.time').optional({ nullable: true }).isInt().withMessage('time must be an integer'),
	checkValidationErrors,
];
