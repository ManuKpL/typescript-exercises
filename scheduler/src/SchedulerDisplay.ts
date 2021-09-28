import { Event } from './Event';

export class SchedulerDisplay {
  public showEvent(event: Event): void {
    for (let n = 0; n < 1000; n++) {
      console.log('[' + event.getDate() + ']');
    }
  }
}
