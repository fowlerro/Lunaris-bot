import { Document, model, Schema } from 'mongoose';

import type { LevelConfig } from 'types';

export interface LevelConfigDocument extends LevelConfig, Document {}

const LevelConfigSchema = new Schema({
	guildId: {
		type: String,
		required: true,
		unique: true,
		minlength: 18,
		maxlength: 18,
	},
	multiplier: {
		type: Number,
		default: 1,
		min: 0,
		max: 5,
	},
	levelUpMessage: {
		messageFormat: {
			type: String,
			maxlength: 256,
		},
		mode: {
			type: String,
			enum: ['off', 'currentChannel', 'specificChannel'],
			default: 'currentChannel',
		},
		channelId: {
			type: String,
			maxlength: 18,
			validate: {
				validator: (val: string) => val.length === 18 || val.length === 0,
			},
		},
	},
	rewards: {
		text: [
			{
				roleId: {
					type: String,
					minlength: 18,
					maxlength: 18,
				},
				level: {
					type: Number,
					min: 1,
					required: true,
				},
				takePreviousRole: {
					type: Boolean,
					default: true,
				},
			},
		],
		voice: [
			{
				roleId: {
					type: String,
					minlength: 18,
					maxlength: 18,
				},
				level: {
					type: Number,
					min: 1,
					required: true,
				},
				takePreviousRole: {
					type: Boolean,
					default: true,
				},
			},
		],
	},
});

export const LevelConfigModel = model<LevelConfigDocument>('LevelConfig', LevelConfigSchema);
