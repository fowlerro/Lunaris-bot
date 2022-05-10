import { AutocompleteInteraction, CommandInteraction, ContextMenuInteraction, Permissions } from 'discord.js';
import { Routes } from 'discord-api-types/v10';

import path from 'node:path';
import fsp from 'node:fs/promises';

import BaseModule from '../../utils/structures/BaseModule';
import { testGuildId } from '@utils/utils';
import type { Command, CommandOption } from 'src/typings/command';
import { botOwners, getLocale } from '@utils/utils';
import { handleCommandError } from '@commands/errors';

const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

class CommandsModule extends BaseModule {
	constructor() {
		super('Commands', true);
	}

	async run() {
		logger.info(this.getName());
		this.load();
	}

	async load() {
		const commandsPath = path.join(__dirname, '../../commands');
		const categories = await fsp.readdir(commandsPath);
		for (const category of categories) {
			const categoryPath = path.join(commandsPath, category);
			const stat = await fsp.lstat(categoryPath);
			if (!stat.isDirectory()) continue;

			const commands = await fsp.readdir(categoryPath);
			for (const commandFolder of commands) {
				const commandPath = path.join(categoryPath, commandFolder);
				const stat = await fsp.lstat(commandPath);
				if (!stat.isDirectory()) continue;

				const { default: command }: { default: Command } = await import(commandPath);
				command.category = category;

				command.autocomplete = await loadAutocomplete(commandPath);

				const commandFiles = await getCommandSubcommands(commandPath);
				for (const commandFile of commandFiles) {
					const subCommandPath = path.join(commandPath, commandFile);
					const stat = await fsp.lstat(subCommandPath);

					if (!stat.isDirectory()) loadSubcommand(command, subCommandPath);

					if (stat.isDirectory()) {
						const subCommandGroup = await fsp.readdir(subCommandPath);
						for (const subCommand of subCommandGroup) {
							const nestedSubCommandPath = path.join(subCommandPath, subCommand);
							if (!isSubcommandFile(nestedSubCommandPath)) continue;

							loadNestedSubcommand(command, commandFile, nestedSubCommandPath);
						}
					}
				}
				client.commands.set(command.name.en, command);
			}
		}
	}

	async register(commandName: string) {
		const command = client.commands.get(commandName);
		if (!command) return;

		const parsedCommand = {
			type: command.type,
			name: command.name.en,
			name_localizations: {
				'en-US': command.name.en,
				pl: command.name.pl,
			},
			...('description' in command && {
				description: command.description.en,
				description_localizations: {
					'en-US': command.description.en,
					pl: command.description.pl,
				},
			}),
			...(command.permissions && { default_member_permissions: Permissions.resolve(command.permissions).toString() }),
			dm_permission: command.dm,
			...('options' in command &&
				command.options?.length && {
					options: parseCommandOptions(command.options),
				}),
		};

		if (command.test)
			return client.REST.post(Routes.applicationGuildCommands(client.application?.id!, testGuildId), {
				body: parsedCommand,
			});

		return client.REST.post(Routes.applicationCommands(client.application?.id!), {
			body: parsedCommand,
		});
	}

	async handle(interaction: CommandInteraction | ContextMenuInteraction) {
		try {
			const { commandName } = interaction;
			const command = client.commands.get(commandName);
			if (!command) return;
			if (command.owner && !botOwners.includes(interaction.user.id)) return;

			const language = getLocale(interaction.guildLocale ?? interaction.locale);

			if (
				interaction instanceof CommandInteraction &&
				(interaction.options.getSubcommand(false) || interaction.options.getSubcommandGroup(false))
			) {
				const subCommandGroup = interaction.options.getSubcommandGroup(false);
				const subCommand = interaction.options.getSubcommand(false);

				if (subCommandGroup && subCommand)
					return command.subcommands[subCommandGroup][subCommand](interaction, language);
				if (subCommand) return command.subcommands[subCommand](interaction, language);
			}

			command.run(interaction as any, language);
		} catch (err) {
			logger.error(err);
			handleCommandError(interaction, 'general.error', 'error', true);
		}
	}

	async autocomplete(interaction: AutocompleteInteraction) {
		const { commandName } = interaction;

		const command = client.commands.get(commandName);
		if (!command) return;
		if (command.owner && !botOwners.includes(interaction.user.id)) return;

		const language = getLocale(interaction.guildLocale ?? interaction.locale);

		command.autocomplete?.(interaction, language);
	}
}

export default new CommandsModule();

function parseCommandOptions(options: CommandOption[]): any {
	return options.map(option => ({
		type: option.type,
		name: option.name.en,
		name_localizations: {
			'en-US': option.name.en,
			pl: option.name.pl,
		},
		description: option.description.en,
		description_localizations: {
			'en-US': option.description.en,
			pl: option.description.pl,
		},
		required: option.required,
		...('choices' in option &&
			option.choices?.length && {
				choices: option.choices?.map(choice => ({
					name: choice.name.en,
					name_localizations: {
						'en-US': choice.name.en,
						pl: choice.name.pl,
					},
					value: choice.value,
				})),
			}),
		...('options' in option &&
			option.options?.length && {
				options: parseCommandOptions(option.options),
			}),
		...('channelTypes' in option && {
			channel_types: option.channelTypes,
		}),
		...('minValue' in option && {
			min_value: option.minValue,
		}),
		...('maxValue' in option && {
			max_value: option.maxValue,
		}),
		...('autocomplete' in option && {
			autocomplete: option.autocomplete,
		}),
	}));
}

async function loadAutocomplete(
	commandPath: string
): Promise<((interaction: AutocompleteInteraction) => void) | undefined> {
	if (!(await autocompleteExists(commandPath))) return undefined;

	const { default: autocomplete } = await import(path.join(commandPath, 'autocomplete'));
	return autocomplete;
}

async function autocompleteExists(commandPath: string): Promise<boolean> {
	return !!(await fsp.stat(path.join(commandPath, `autocomplete.${fileExtension}`)).catch(e => false));
}

async function isSubcommandFile(subCommandPath: string): Promise<boolean> {
	const subCommandFile = path.basename(subCommandPath);
	const stat = await fsp.lstat(subCommandPath);
	if (stat.isDirectory()) return false;
	if (!stat.isFile()) return false;
	if (path.parse(subCommandFile).ext !== `.${fileExtension}`) return false;
	return true;
}

async function getCommandSubcommands(commandPath: string): Promise<string[]> {
	return (await fsp.readdir(commandPath)).filter(
		file => path.parse(file).name !== 'index' && path.parse(file).name !== 'autocomplete'
	);
}

async function loadSubcommand(command: Command, subCommandPath: string): Promise<boolean> {
	const commandFile = path.basename(subCommandPath);
	if (path.parse(commandFile).ext !== `.${fileExtension}`) return false;
	const { default: subCommandFunc } = await import(subCommandPath);
	if (!subCommandFunc) return false;
	if (!command.subcommands) command.subcommands = {};
	command.subcommands[path.parse(commandFile).name] = subCommandFunc;
	return true;
}

async function loadNestedSubcommand(
	command: Command,
	subCommandGroup: string,
	subCommandPath: string
): Promise<boolean> {
	const subCommand = path.basename(subCommandPath);

	const { default: subCommandFunc } = await import(subCommandPath);
	if (!subCommandFunc) return false;

	if (!command.subcommands[path.parse(subCommandGroup).name])
		command.subcommands[path.parse(subCommandGroup).name] = {};
	command.subcommands[path.parse(subCommandGroup).name][path.parse(subCommand).name] = subCommandFunc;
	return true;
}
