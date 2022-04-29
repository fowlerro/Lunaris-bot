import { Message, MessageReaction, User } from 'discord.js';

import type { InteractiveRolesType } from 'types';

export default async function createReactionCollector(interactiveRoles: InteractiveRolesType, message: Message) {
	const filter = (reaction: MessageReaction, user: User) =>
		interactiveRoles.roles.some(role => reaction.emoji.toString() === role.icon && !user.bot);

	interactiveRoles.roles.forEach(async role => {
		await message.react(role.icon!).catch(logger.error);
	});

	const emojiCollector = message.createReactionCollector({ filter, dispose: true });
	emojiCollector.on('collect', (message, user) => handleReactionAdd(message, user, interactiveRoles));
	emojiCollector.on('remove', (message, user) => handleReactionRemove(message, user, interactiveRoles));
}

async function handleReactionAdd(messageReaction: MessageReaction, user: User, interactiveRoles: InteractiveRolesType) {
	if (!client.isOnline) return;
	const role = interactiveRoles.roles.find(role => role.icon === messageReaction.emoji.toString());
	if (!role) return;
	const roleId = role.roleId;
	const member = await messageReaction.message.guild?.members.fetch(user.id).catch(logger.error);
	if (!member) return;

	if (role.action === 'add' || role.action === 'remove') messageReaction.users.remove(member);

	if (role.action === 'remove') return member.roles.remove(roleId).catch(logger.error);

	return member.roles.add(roleId).catch(logger.error);
}

async function handleReactionRemove(
	messageReaction: MessageReaction,
	user: User,
	interactiveRoles: InteractiveRolesType
) {
	if (!client.isOnline) return;
	const role = interactiveRoles.roles.find(role => role.icon === messageReaction.emoji.toString());
	if (!role) return;
	if (role.action !== 'toggle') return;
	const roleId = role.roleId;
	const member = await messageReaction.message.guild?.members.fetch(user.id).catch(logger.error);
	if (!member) return;

	await member.roles.remove(roleId).catch(logger.error);
}
