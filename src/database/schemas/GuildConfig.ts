import { model, Schema } from 'mongoose';

import type { GuildConfig } from 'types';

// export interface GuildConfigDocument extends GuildConfig, Document {}

const GuildConfigSchema = new Schema<GuildConfig>({
	guildId: {
		type: String,
		required: true,
		unique: true,
	},
	modules: {
		autoRole: {
			type: Boolean,
			default: false,
		},
		welcomeMessage: {
			type: Boolean,
			default: false,
		},
		serverLogs: {
			type: Boolean,
			default: false,
		},
		levels: {
			type: Boolean,
			default: false,
		},
	},
});

GuildConfigSchema.index({ guildId: 1 });

export const GuildConfigModel = model('GuildConfig', GuildConfigSchema);
