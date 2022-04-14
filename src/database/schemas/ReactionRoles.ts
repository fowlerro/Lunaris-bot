import { Snowflake } from 'discord.js';
import { model, Schema } from 'mongoose';

import {
	ReactionRoleAction,
	ReactionRoleType,
	REACTION_ROLE_ACTIONS,
	REACTION_ROLE_TYPES,
} from '@modules/reactionRoles';

export interface ReactionRoleItem {
	label?: string;
	icon?: string;
	roleId: Snowflake;
	action: ReactionRoleAction;
}

export interface ReactionRole {
	guildId: Snowflake;
	channelId: Snowflake;
	messageId: Snowflake;
	type: ReactionRoleType;
	reactions: ReactionRoleItem[];
}

const ReactionRoleSchema = new Schema<ReactionRole>({
	guildId: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	messageId: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: REACTION_ROLE_TYPES,
		required: true,
	},
	reactions: {
		type: [
			{
				label: {
					type: String,
					maxlength: 80,
					validate: {
						validator: function (value: string) {
							return ((this as ReactionRole).type === 'reactions' && value.length >= 1) || true;
						},
					},
				},
				icon: {
					type: String,
					maxlength: 80,
					validate: {
						validator: function (value: string) {
							return (this as ReactionRole).type !== 'reactions';
						},
					},
				},
				roleId: {
					type: String,
					maxlength: 18,
					minlength: 18,
					required: true,
				},
				action: {
					type: String,
					enum: REACTION_ROLE_ACTIONS,
					required: true,
				},
			},
		],
		validate: {
			validator: (value: ReactionRoleItem[]) => value.length <= 25,
		},
	},
});

ReactionRoleSchema.index({ guildId: 1, channelId: 1, messageId: 1 }, { unique: true });

export const ReactionRoleModel = model<ReactionRole>('ReactionRole', ReactionRoleSchema);
