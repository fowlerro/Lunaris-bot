import { Document, model, Schema } from 'mongoose';

import { EMBED_LIMITS, palette } from '../../utils/utils';
import type { EmbedMessage } from 'types';

export interface EmbedDocument extends Omit<EmbedMessage, '_id'>, Document {}

const EmbedSchema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: [32, 'Embed name must be less than 32 characters'],
	},
	guildId: {
		type: String,
		required: true,
		minlength: [18, 'Invalid guild id'],
		maxlength: [18, 'Invalid guild id'],
	},
	channelId: {
		type: String,
		maxlength: [18, 'Invalid channel id'],
		validate: {
			validator: (val: string) => val.length === 18 || val.length === 0,
			message: 'Invalid channel id',
		},
	},
	messageId: {
		type: String,
		maxlength: [18, 'Invalid message id'],
		validate: {
			validator: (val: string) => val.length === 18 || val.length === 0,
			message: 'Invalid message id',
		},
	},
	messageContent: {
		type: String,
		maxlength: [2000, 'Message content must be less than 2000 characters'],
	},
	embed: {
		author: {
			name: {
				type: String,
				maxlength: [EMBED_LIMITS.author, `Embed author name must be less than ${EMBED_LIMITS.author} characters`],
			},
			url: String,
			iconURL: String,
		},
		hexColor: {
			type: String,
			maxlength: [7, 'Hex color must be less than 7 characters'],
			default: palette.info,
		},
		description: {
			type: String,
			maxlength: [
				EMBED_LIMITS.description,
				`Embed description must be less than ${EMBED_LIMITS.description} characters`,
			],
		},
		footer: {
			text: {
				type: String,
				maxlength: [EMBED_LIMITS.footer, `Embed footer text must be less than ${EMBED_LIMITS.footer} characters`],
			},
			iconURL: String,
		},
		image: {
			url: String,
			width: {
				type: Number,
				validate: {
					validator: Number.isInteger,
					message: 'Image width must be an integer',
				},
			},
			height: {
				type: Number,
				validate: {
					validator: Number.isInteger,
					message: 'Image height must be an integer',
				},
			},
		},
		thumbnail: {
			url: String,
			width: {
				type: Number,
				validate: {
					validator: Number.isInteger,
					message: 'Thumbnail width must be an integer',
				},
			},
			height: {
				type: Number,
				validate: {
					validator: Number.isInteger,
					message: 'Thumbnail height must be an integer',
				},
			},
		},
		timestamp: {
			type: Number,
		},
		title: {
			type: String,
			maxlength: [EMBED_LIMITS.title, `Embed title must be less than ${EMBED_LIMITS.title} characters`],
		},
		url: String,
		fields: [
			{
				name: {
					type: String,
					maxlength: [
						EMBED_LIMITS.field.name,
						`Embed field name must be less than ${EMBED_LIMITS.field.name} characters`,
					],
				},
				value: {
					type: String,
					maxlength: [
						EMBED_LIMITS.field.value,
						`Embed field value must be less than ${EMBED_LIMITS.field.value} characters`,
					],
				},
				inline: {
					type: Boolean,
					default: false,
				},
			},
		],
	},
});

export const EmbedModel = model<EmbedDocument>('Embed', EmbedSchema);
