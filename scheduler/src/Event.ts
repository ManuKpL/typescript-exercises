export class Event {
  private date: Date;
  private slot: number;

  public constructor(date: Date, slot: number) {
    this.date = date;
    this.slot = slot;
  }

  public added(): void {}

  public getDate(): Date {
    return this.date;
  }

  public getSlot(): number {
    return this.slot;
  }

  public toString(): string {
    return this.date + ' @' + this.slot + ':00 hours';
  }
}
