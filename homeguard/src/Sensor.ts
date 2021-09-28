export class Sensor {
  public static readonly DOOR: string = 'door';
  public static readonly MOTION: string = 'motion';
  public static readonly WINDOW: string = 'window';
  public static readonly FIRE: string = 'fire';

  private id: string;
  private location: string;
  private type: string;
  private tripped: boolean = false;

  public constructor(id: string, location: string, type: string) {
    this.id = id;
    this.location = location;
    this.type = type;
  }

  public getId(): string {
    return this.id;
  }

  public getType(): string {
    return this.type;
  }

  public getLocation(): string {
    return this.location;
  }

  public trip(): void {
    this.tripped = true;
  }

  public reset(): void {
    this.tripped = false;
  }

  public isTripped(): boolean {
    return this.tripped;
  }
}
