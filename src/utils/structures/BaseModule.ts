export default abstract class BaseModule {
    constructor(
        private name: string,
        private enabled: boolean
    ) {
        const handler = {
            get: (obj: any, prop: string) => (
                (typeof obj[prop] !== 'function' || ['getName', 'isEnabled'].includes(prop)) ? obj[prop] : function(...args: any) {
                    if(obj.isEnabled()) obj[prop].apply(obj, args)
                }
            )
        }
        return new Proxy(this, handler)
    }

    getName(): string { return this.name; }
    isEnabled(): boolean { return this.enabled; }
    abstract run(): Promise<void>;
}

