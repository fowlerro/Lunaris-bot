import { model, Schema } from 'mongoose';

import type { GuildLogs } from 'types';
import { optionalSnowflake } from '../mongoose';

const GuildLogsSchema = new Schema<GuildLogs>({
	guildId: {
		type: String,
		required: true,
		unique: true,
		minlength: 18,
		maxlength: 18,
	},
	logs: {
		messages: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				edit: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
				purge: { type: Boolean, default: false },
				pin: { type: Boolean, default: false },
				unpin: { type: Boolean, default: false },
			},
		},
		emojis: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				create: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
				edit: { type: Boolean, default: false },
			},
		},
		roles: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				create: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
				edit: { type: Boolean, default: false },
				add: { type: Boolean, default: false },
				remove: { type: Boolean, default: false },
			},
		},
		channels: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				create: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
				edit: { type: Boolean, default: false },
			},
		},
		threads: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				create: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
				edit: { type: Boolean, default: false },
			},
		},
		invites: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				create: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
			},
		},
		members: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				join: { type: Boolean, default: false },
				leave: { type: Boolean, default: false },
				nicknameChange: { type: Boolean, default: false },
				warn: { type: Boolean, default: false },
				unwarn: { type: Boolean, default: false },
				unwarnAll: { type: Boolean, default: false },
				kick: { type: Boolean, default: false },
				timeout: { type: Boolean, default: false },
				timeoutRemove: { type: Boolean, default: false },
				ban: { type: Boolean, default: false },
				unban: { type: Boolean, default: false },
			},
		},
		server: {
			channelId: {
				type: String,
				maxlength: 18,
				validate: {
					validator: optionalSnowflake,
				},
			},
			logs: {
				unwarnAll: { type: Boolean, default: false },
			},
		},
	},
});

export const GuildLogsModel = model<GuildLogs>('GuildLogs', GuildLogsSchema);
