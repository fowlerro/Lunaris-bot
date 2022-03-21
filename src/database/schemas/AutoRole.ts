import { model, Schema } from 'mongoose';

import type { AutoRoleConfig } from 'types';

const AutoRoleSchema = new Schema<AutoRoleConfig>({
	guildId: {
		type: String,
		required: true,
		unique: true,
	},
	roles: {
		type: [
			{
				roleId: {
					type: String,
					required: true,
					unique: true,
					sparse: true,
				},
				time: {
					type: Number,
				},
			},
		],
		default: [],
	},
});

AutoRoleSchema.index({ guildId: 1 });

export const AutoRoleModel = model('AutoRole', AutoRoleSchema);
