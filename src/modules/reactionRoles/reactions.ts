import { Message, MessageReaction, User } from 'discord.js';

import { ReactionRole } from '@schemas/ReactionRoles';

export default async function createReactionCollector(reactionRole: ReactionRole, message: Message) {
	const filter = (reaction: MessageReaction, user: User) =>
		reactionRole.reactions.some(element => reaction.emoji.toString() === element.label && !user.bot);

	reactionRole.reactions.forEach(async element => {
		await message.react(element.label!).catch(logger.error);
	});

	const emojiCollector = message.createReactionCollector({ filter, dispose: true });
	emojiCollector.on('collect', (message, user) => handleReactionAdd(message, user, reactionRole));
	emojiCollector.on('remove', (message, user) => handleReactionRemove(message, user, reactionRole));
}

async function handleReactionAdd(messageReaction: MessageReaction, user: User, reactionRole: ReactionRole) {
	if (!client.isOnline) return;
	const reaction = reactionRole.reactions.find(
		reactionRoleItem => reactionRoleItem.label === messageReaction.emoji.toString()
	);
	if (!reaction) return;
	const roleId = reaction.roleId;
	const member = await messageReaction.message.guild?.members.fetch(user.id).catch(logger.error);
	if (!member) return;

	if (reaction.action === 'add' || reaction.action === 'remove') messageReaction.users.remove(member);

	if (reaction.action === 'remove') return member.roles.remove(roleId).catch(logger.error);

	return member.roles.add(roleId).catch(logger.error);
}

async function handleReactionRemove(messageReaction: MessageReaction, user: User, reactionRole: ReactionRole) {
	if (!client.isOnline) return;
	const reaction = reactionRole.reactions.find(
		reactionRoleItem => reactionRoleItem.label === messageReaction.emoji.toString()
	);
	if (!reaction) return;
	if (reaction.action !== 'toggle') return;
	const roleId = reaction.roleId;
	const member = await messageReaction.message.guild?.members.fetch(user.id).catch(logger.error);
	if (!member) return;

	await member.roles.remove(roleId).catch(logger.error);
}
