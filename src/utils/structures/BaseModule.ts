export default abstract class BaseModule {
    constructor(
        private name: string,
        private enabled: boolean
    ) { }

    getName(): string { return this.name; }
    isEnabled(): boolean { return this.enabled; }
    abstract run(): Promise<void>;
}
