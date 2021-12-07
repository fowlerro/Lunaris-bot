import { ApplicationCommandOptionData, ApplicationCommandType, CommandInteraction } from 'discord.js'

interface CommandDescription {
    pl: string
    en: string
}

export default abstract class BaseCommand {
    constructor(
        private _name: string,
        private _description: CommandDescription,
        private _type: ApplicationCommandType = 'CHAT_INPUT',
        private _options: ApplicationCommandOptionData[] = [],
        private _defaultPermission: boolean = true,
    ) {}
    
    get name(): string { return this._name }
    get description(): CommandDescription { return this._description }
    get type(): ApplicationCommandType { return this._type }
    get options(): ApplicationCommandOptionData[] { return this._options }
    get defaultPermission(): boolean { return this._defaultPermission }
    abstract run(interaction: CommandInteraction): Promise<void>;
}