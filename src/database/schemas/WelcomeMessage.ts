import { Document, model, Schema } from 'mongoose';

import type { WelcomeMessage } from 'types';

const WelcomeMessageSchema = new Schema<WelcomeMessage>({
	guildId: {
		type: String,
		required: true,
		unique: true,
	},
	status: {
		type: Boolean,
		default: false,
	},
	channels: {
		join: {
			type: String,
			default: null,
		},
		leave: {
			type: String,
			default: null,
		},
	},
	formats: [
		{
			message: String,
			action: {
				type: String,
				enum: ['join', 'leave'],
				default: 'join',
			},
		},
	],
});

export const WelcomeMessageModel = model<WelcomeMessage>('WelcomeMessage', WelcomeMessageSchema);
