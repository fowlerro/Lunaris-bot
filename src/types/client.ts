import { Client, ClientOptions, Collection } from 'discord.js';
import { Snowflake } from 'discord-api-types';
import BaseEvent from '../utils/structures/BaseEvent';
import Command from '../utils/structures/Command';
import { GuildConfig } from '../modules/Guilds/types';
import BaseModule from '../utils/structures/BaseModule';

export default class DiscordClient extends Client {

  public isOnline = true
  private _commands = new Collection<string, Command>();
  private _events = new Collection<string, BaseEvent>();
  private _modules = new Collection<string, BaseModule>();
  private _guildConfigs = new Collection<Snowflake, GuildConfig>();

  constructor(options: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, Command> { return this._commands; }
  get events(): Collection<string, BaseEvent> { return this._events; }
  get modules(): Collection<string, BaseModule> { return this._modules; }
  get guildConfigs(): Collection<Snowflake, GuildConfig> { return this._guildConfigs; }

}
