import { model, Schema, Document } from 'mongoose';

import { palette } from '../../utils/utils';
import type { Profile } from 'types';

export interface ProfileDocument extends Profile, Document {}

const ProfileSchema = new Schema<Profile>({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	coins: {
		type: Number,
		default: 0,
	},
	statistics: {
		text: {
			level: {
				type: Number,
				default: 1,
			},
			xp: {
				type: Number,
				default: 0,
			},
			totalXp: {
				type: Number,
				default: 0,
			},
			dailyXp: {
				type: Number,
				default: 0,
			},
		},
		voice: {
			level: {
				type: Number,
				default: 1,
			},
			xp: {
				type: Number,
				default: 0,
			},
			totalXp: {
				type: Number,
				default: 0,
			},
			dailyXp: {
				type: Number,
				default: 0,
			},
			timeSpent: {
				type: Number,
				default: 0,
			},
		},
	},
	cardAppearance: {
		background: {
			type: Number,
			default: 0,
		},
		customBackground: {
			type: Buffer,
		},
		accent: {
			type: String,
			default: palette.primary,
		},
	},
});

export const ProfileModel = model('Profiles', ProfileSchema);
