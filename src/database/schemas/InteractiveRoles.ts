import { model, Schema, HydratedDocument } from 'mongoose';

import { INTERACTIVE_ROLE_ACTIONS, INTERACTIVE_ROLE_STYLES, INTERACTIVE_ROLE_TYPES } from '@modules/InteractiveRoles';

import type { InteractiveRoleItem, InteractiveRolesType } from 'types';

const InteractiveRolesSchema = new Schema<InteractiveRolesType>({
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
		enum: INTERACTIVE_ROLE_TYPES,
		required: true,
	},
	placeholder: {
		type: String,
		maxlength: 150,
	},
	roles: {
		type: [
			{
				label: {
					type: String,
					maxlength: 80,
				},
				description: {
					type: String,
					maxlength: 100,
				},
				icon: {
					type: String,
					maxlength: 80,
				},
				style: {
					type: String,
					enum: INTERACTIVE_ROLE_STYLES,
				},
				roleId: {
					type: String,
					maxlength: 18,
					minlength: 18,
					required: true,
				},
				action: {
					type: String,
					enum: INTERACTIVE_ROLE_ACTIONS,
				},
			},
		],
		validate: {
			validator: (value: InteractiveRoleItem[]) => value.length <= 25,
		},
	},
});

InteractiveRolesSchema.index({ guildId: 1, channelId: 1, messageId: 1 }, { unique: true });
InteractiveRolesSchema.post<HydratedDocument<InteractiveRolesType>>('validate', function (next) {
	if (this.type !== 'buttons') {
		if (!this.roles.every(item => item.label))
			this.invalidate('roles.i.label', 'Item label is required for reactions and selects type');
		if (this.roles.some(item => item.style))
			this.invalidate('roles.i.style', 'Item style can be set only for buttons type');
	}
	if (this.type !== 'select') {
		if (this.placeholder) return this.invalidate('placeholder', 'Placeholder is only valid for selects');
		if (this.roles.some(item => item.description))
			this.invalidate('roles.i.description', 'Item description can be set only for selects type');
		if (this.roles.some(item => !item.action))
			this.invalidate('roles.i.action', 'Item action is required for reactions and buttons type');
	}
	if (this.type === 'reactions') {
		if (this.roles.some(item => item.icon))
			this.invalidate('roles.i.icon', 'Item icon cannot be set for reactions type');
	}
});

export const InteractiveRolesModel = model<InteractiveRolesType>('InteractiveRoles', InteractiveRolesSchema);
