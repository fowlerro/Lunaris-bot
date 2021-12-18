export default abstract class BaseEvent {
  constructor(private name: string) { }

  getName(): string { return this.name; }
  abstract run(...args: any): void;
}
