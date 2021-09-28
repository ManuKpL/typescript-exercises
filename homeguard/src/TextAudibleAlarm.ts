import { AudibleAlarm } from './AudibleAlarm';

export class TextAudibleAlarm implements AudibleAlarm {
  private isOn: boolean = false;

  public sound(): void {
    this.isOn = true;

    const handler = setInterval(() => {
      if (this.isOn) {
        console.log('BUZZ BUZZ BUZZ!!!');
      } else {
        clearInterval(handler);
      }
    }, 1000);
  }

  public silence(): void {
    this.isOn = false;
  }
}
