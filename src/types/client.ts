import { ActivityOptions, Client, ClientOptions, Collection } from 'discord.js';
import { Snowflake } from 'discord-api-types';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseModule from '../utils/structures/BaseModule';
import BaseCommand from '../utils/structures/BaseCommand';
import { GuildConfig } from '../database/schemas/GuildConfig';
import { Profile } from '../database/schemas/Profile';
import { GuildMember } from '../database/schemas/GuildMembers';

export default class DiscordClient extends Client {

  public isOnline = true
  public customActivity: ActivityOptions = {
    name: '',
    type: "PLAYING"
  }
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _modules = new Collection<string, BaseModule>();
  private _guildConfigs = new Collection<Snowflake, GuildConfig>();
  private _profiles = new Collection<Snowflake, Profile>();
  private _guildMembers = new Collection<string, GuildMember>();

  constructor(options: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, BaseCommand> { return this._commands; }
  get events(): Collection<string, BaseEvent> { return this._events; }
  get modules(): Collection<string, BaseModule> { return this._modules; }
  get guildConfigs(): Collection<Snowflake, GuildConfig> { return this._guildConfigs; }
  get profiles(): Collection<Snowflake, Profile> { return this._profiles; }
  get guildMembers(): Collection<string, GuildMember> { return this._guildMembers; }

}
