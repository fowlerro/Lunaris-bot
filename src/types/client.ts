import { REST } from '@discordjs/rest';
import { ActivityOptions, Client, ClientOptions, Collection } from 'discord.js';

import BaseEvent from '../utils/structures/BaseEvent';
import BaseModule from '../utils/structures/BaseModule';
import { Command } from './command';
// import BaseCommand from '../utils/structures/BaseCommand';

export default class DiscordClient extends Client {
	public isOnline = false;
	public customActivity: ActivityOptions = {
		name: '',
		type: 'PLAYING',
	};
	public REST = new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_TOKEN!);
	private _commands = new Collection<string, Command>();
	private _events = new Collection<string, BaseEvent>();
	private _modules = new Collection<string, BaseModule>();

	constructor(options: ClientOptions) {
		super(options);
	}

	get commands(): Collection<string, Command> {
		return this._commands;
	}
	get events(): Collection<string, BaseEvent> {
		return this._events;
	}
	get modules(): Collection<string, BaseModule> {
		return this._modules;
	}
}
