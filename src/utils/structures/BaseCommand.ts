import { ApplicationCommandOptionData, ApplicationCommandType, AutocompleteInteraction, CommandInteraction, ContextMenuInteraction } from 'discord.js'

interface CommandDescription {
    pl: string
    en: string
}

export default abstract class BaseCommand {
    constructor(
        private _name: string,
        private _type: ApplicationCommandType = 'CHAT_INPUT',
        private _description: CommandDescription,
        private _options: ApplicationCommandOptionData[] = [],
        private _defaultPermission: boolean = true,
        private _test: boolean = false,
        private _status: boolean = true,
        private _globalStatus: boolean = true
    ) {}

    public category: string[] = [];
    
    get name(): string { return this._name }
    get type(): ApplicationCommandType { return this._type }
    get description(): CommandDescription { return this._description }
    get options(): ApplicationCommandOptionData[] { return this._options }
    get defaultPermission(): boolean { return this._defaultPermission }
    get test(): boolean { return this._test }
    get status(): boolean { return this._status }
    get globalStatus(): boolean { return this._globalStatus }
    abstract run(interaction: CommandInteraction | ContextMenuInteraction): Promise<void>
    async autocomplete?(interaction: AutocompleteInteraction): Promise<void>
}