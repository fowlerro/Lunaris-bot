import { ActivityOptions, Client, ClientOptions, Collection, Snowflake } from 'discord.js';

import BaseEvent from '../utils/structures/BaseEvent';
import BaseModule from '../utils/structures/BaseModule';
import BaseCommand from '../utils/structures/BaseCommand';

import { GuildConfigDocument } from '../database/schemas/GuildConfig';
import { ProfileDocument } from '../database/schemas/Profile';
import { GuildProfileDocument } from '../database/schemas/GuildProfile';

export default class DiscordClient extends Client {

  public isOnline = false
  public customActivity: ActivityOptions = {
    name: '',
    type: "PLAYING"
  }
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _modules = new Collection<string, BaseModule>();
  private _guildConfigs = new Collection<Snowflake, GuildConfigDocument>();
  private _profiles = new Collection<Snowflake, ProfileDocument>();
  private _guildMembers = new Collection<string, GuildProfileDocument>();

  constructor(options: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, BaseCommand> { return this._commands; }
  get events(): Collection<string, BaseEvent> { return this._events; }
  get modules(): Collection<string, BaseModule> { return this._modules; }
  get guildConfigs(): Collection<Snowflake, GuildConfigDocument> { return this._guildConfigs; }
  get profiles(): Collection<Snowflake, ProfileDocument> { return this._profiles; }
  get guildMembers(): Collection<string, GuildProfileDocument> { return this._guildMembers; }

}
