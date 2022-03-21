import { Snowflake } from 'discord.js';
import { model, Schema } from 'mongoose';

import type { AutoRole } from 'types';

export interface AutoRoleTime {
	guildId: Snowflake;
	userId: Snowflake;
	roles: AutoRole[];
}

const AutoRoleTimeSchema = new Schema<AutoRoleTime>({
	guildId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	roles: [
		{
			roleId: {
				type: String,
				required: true,
			},
			time: {
				type: Number,
				required: true,
			},
		},
	],
});

AutoRoleTimeSchema.index({ guildId: 1, userId: 1 }, { unique: true });

export const AutoRoleTimeModel = model('AutoRoleTime', AutoRoleTimeSchema);
