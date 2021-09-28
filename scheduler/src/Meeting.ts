import { Event } from './Event';
import { TimeServices } from './TimeServices';

export class Meeting extends Event {
  private description: string;

  public constructor(date: Date, slot: number, description: string) {
    super(date, slot);
    this.description = description;
  }

  public getText(): string {
    return this.description;
  }

  public isPastDue(): boolean {
    return TimeServices.isPastDue(this.getDate());
  }

  public toString(): string {
    const buffer: string[] = [];
    let n = 0;
    buffer.push(super.toString());
    let result: string = this.formatText(this.description);
    buffer.push('[' + result.length);
    for (n = 0; n < result.length; n++) {
      buffer.push('{');
    }
    buffer.push(this.formatText(this.description));
    for (n = 0; n < result.length; n++) {
      buffer.push('}');
    }
    buffer.push(result.length + ']');

    return new String(result).valueOf();
  }

  public appendToText(newText: string): void {
    this.description += newText;
  }

  private formatText(text: string): string {
    const result: string[] = [];
    for (let n = 0; n < text.length; ++n) {
      const c = text.charAt(n);
      if (c === '<') {
        while (text.charAt(n) !== '/' && text.charAt(n) !== '>') n++;
        if (text.charAt(n) === '/') n += 4;
        else n++;
      }
      if (n < text.length) result.push(text.charAt(n));
    }
    return result.join('');
  }
}
