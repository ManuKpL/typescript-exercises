import { AudibleAlarm } from './AudibleAlarm';

export class MockAudibleAlarm implements AudibleAlarm {
  public isOn: boolean = false;

  public sound(): void {
    this.isOn = true;
  }

  public silence(): void {
    this.isOn = false;
  }
}
