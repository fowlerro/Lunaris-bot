import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	AutocompleteInteraction,
	CommandInteraction,
	CommandOptionChannelResolvableType,
	ContextMenuInteraction,
	PermissionResolvable,
} from 'discord.js';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'discord.js/typings/enums';
import { Language } from 'types';

interface Localizations {
	en: string;
	pl?: string;
}

interface CommandOptionChoice<T extends string | number> {
	name: Localizations;
	value: T;
}

interface BaseCommandOption {
	type: ApplicationCommandOptionTypes;
	name: Localizations;
	description: Localizations;
	required?: boolean;
}

interface SubCommandOption extends BaseCommandOption {
	type: ApplicationCommandOptionTypes.SUB_COMMAND | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
	options?: CommandOption[];
}

interface StringCommandOption extends BaseCommandOption {
	type: ApplicationCommandOptionTypes.STRING;
	choices?: CommandOptionChoice<string>[];
	autocomplete?: boolean;
}

interface NumberCommandOption extends BaseCommandOption {
	type: ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.INTEGER;
	choices?: CommandOptionChoice<number>[];
	minValue?: number;
	maxValue?: number;
	autocomplete?: boolean;
}

interface ChannelCommandOption extends BaseCommandOption {
	type: ApplicationCommandOptionTypes.CHANNEL;
	channelTypes?: ChannelTypes[];
}

export type CommandOption =
	| BaseCommandOption
	| SubCommandOption
	| StringCommandOption
	| NumberCommandOption
	| ChannelCommandOption;

interface BaseCommand {
	type: ApplicationCommandTypes;
	name: Localizations;
	permissions?: PermissionResolvable;
	dm: boolean;
	test?: boolean;
	owner?: boolean;
	category?: string;
	autocomplete?: (interaction: AutocompleteInteraction, language: Language) => void;
	subcommands?: any;
}

interface ChatInputCommand extends BaseCommand {
	type: ApplicationCommandTypes.CHAT_INPUT;
	description: Localizations;
	options?: CommandOption[];
	run: (interaction: CommandInteraction, language: Language) => void;
}

interface ContextMenuCommand extends BaseCommand {
	type: ApplicationCommandTypes.MESSAGE | ApplicationCommandTypes.USER;
	run: (interaction: ContextMenuInteraction, language: Language) => void;
}

export type Command = ChatInputCommand | ContextMenuCommand;
