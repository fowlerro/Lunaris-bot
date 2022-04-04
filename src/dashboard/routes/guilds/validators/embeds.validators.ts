import { check } from 'express-validator';
import { checkValidationErrors } from '../../../utils/middlewares';
import { EMBED_LIMITS } from '../../../../utils/utils';

export const saveEmbedMessagesValidator = [
	check('embedMessage.name')
		.notEmpty()
		.withMessage('Embed name is required')
		.isString()
		.withMessage('Embed name must be a string')
		.isLength({ max: 32 })
		.withMessage('Embed name must be less than 32 characters'),
	check('embedMessage.channelId')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Channel id must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid channel id'),
	check('embedMessage.messageId')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Message id must be a string')
		.isLength({ min: 18, max: 18 })
		.withMessage('Invalid message id'),
	check('embedMessage.messageContent')
		.optional({ checkFalsy: true })
		.isString()
		.withMessage('Message content must be a string')
		.isLength({ max: 2000 })
		.withMessage('Message content must be less than 2000 characters'),
	check('embedMessage.embed')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('Embed is required')
		.isObject({ strict: true })
		.withMessage('Embed must be an object'),
	check('embedMessage.embed.author.name')
		.isString()
		.withMessage('Embed author name must be a string')
		.isLength({ max: EMBED_LIMITS.author })
		.withMessage(`Embed author name must be less than ${EMBED_LIMITS.author} characters`)
		.if(
			check('embedMessage.embed.author.url').not().notEmpty() ||
				check('embedMessage.embed.author.iconURL').not().notEmpty()
		)
		.optional({ checkFalsy: true }),
	check('embedMessage.embed.author.url')
		.optional({ checkFalsy: true, nullable: true })
		.isURL()
		.withMessage('Embed author url must be a valid url'),
	check('embedMessage.embed.author.iconURL')
		.optional({ checkFalsy: true, nullable: true })
		.isURL()
		.withMessage('Embed author icon url must be a valid url'),
	check('embedMessage.embed.hexColor')
		.notEmpty()
		.withMessage('Color is required')
		.isHexColor()
		.withMessage('Color must be a valid hex color'),
	check('embedMessage.embed.description')
		.optional({ checkFalsy: true, nullable: true })
		.isString()
		.withMessage('Description must be a string')
		.isLength({ max: EMBED_LIMITS.description })
		.withMessage(`Description must be less than ${EMBED_LIMITS.description} characters`),
	check('embedMessage.embed.footer.text')
		.isString()
		.withMessage('Footer text must be a string')
		.isLength({ max: EMBED_LIMITS.footer })
		.withMessage(`Footer text must be less than ${EMBED_LIMITS.footer} characters`)
		.if(check('embedMessage.embed.footer.iconURL').not().isEmpty())
		.optional({ checkFalsy: true, nullable: true }),
	check('embedMessage.embed.footer.iconURL')
		.optional({ checkFalsy: true, nullable: true })
		.isURL()
		.withMessage('Footer icon url must be a valid url'),
	check('embedMessage.embed.image.url')
		.optional({ checkFalsy: true, nullable: true })
		.isURL()
		.withMessage('Image url must be a valid url'),
	check('embedMessage.embed.image.width')
		.optional({ checkFalsy: true, nullable: true })
		.isInt()
		.withMessage('Image width must be an integer'),
	check('embedMessage.embed.image.height')
		.optional({ checkFalsy: true, nullable: true })
		.isInt()
		.withMessage('Image height must be an integer'),
	check('embedMessage.embed.thumbnail.url')
		.optional({ checkFalsy: true, nullable: true })
		.isURL()
		.withMessage('Thumbnail url must be a valid url'),
	check('embedMessage.embed.thumbnail.width')
		.optional({ checkFalsy: true, nullable: true })
		.isInt()
		.withMessage('Thumbnail width must be an integer'),
	check('embedMessage.embed.thumbnail.height')
		.optional({ checkFalsy: true, nullable: true })
		.isInt()
		.withMessage('Thumbnail height must be an integer'),
	check('embedMessage.embed.timestamp')
		.optional({ checkFalsy: true, nullable: true })
		.isInt()
		.withMessage('Timestamp must be an integer'),
	check('embedMessage.embed.title')
		.optional({ checkFalsy: true, nullable: true })
		.isString()
		.withMessage('Title must be a string')
		.isLength({ max: EMBED_LIMITS.title })
		.withMessage(`Title must be less than ${EMBED_LIMITS.title} characters`),
	check('embedMessage.embed.url').optional({ checkFalsy: true, nullable: true }).isURL().withMessage('Invalid URL'),
	check('embedMessage.embed.fields')
		.isArray({ min: 0, max: EMBED_LIMITS.field.amount })
		.withMessage(`Fields must be an array with a maximum of ${EMBED_LIMITS.field.amount} items`),
	check('embedMessage.embed.fields.*.name')
		.isString()
		.withMessage('Field name must be a string')
		.isLength({ max: EMBED_LIMITS.field.name })
		.withMessage(`Field name must be less than ${EMBED_LIMITS.field.name} characters`),
	check('embedMessage.embed.fields.*.value')
		.isString()
		.withMessage('Field value must be a string')
		.isLength({ max: EMBED_LIMITS.field.value })
		.withMessage(`Field value must be less than ${EMBED_LIMITS.field.value} characters`),
	check('embedMessage.embed.fields.*.inline').isBoolean().withMessage('Field inline must be a boolean'),
	check('withoutSending').optional().isBoolean(),
	checkValidationErrors,
];

export const deleteEmbedMessageValidator = [
	check('embedId').isMongoId().withMessage('Invalid embed id'),
	checkValidationErrors,
];
