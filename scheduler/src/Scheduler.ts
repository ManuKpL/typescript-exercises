import { Event } from './Event';
import { MailService } from './MailService';
import { SchedulerDisplay } from './SchedulerDisplay';
import { Meeting } from './Meeting';
import { NoteRetriever } from './NoteRetriever';
import { TimeServices } from './TimeServices';

export class Scheduler {
  private owner: string = '';
  private mailService: MailService;
  private display: SchedulerDisplay;
  private events: Set<Event> = new Set();

  public constructor(owner: string) {
    this.owner = owner;

    this.mailService = MailService.getInstance();
    this.display = new SchedulerDisplay();
  }

  public addEvent(event: Event): void {
    event.added();
    this.events.add(event);
    this.mailService.sendMail('jacques@spg1.com', 'Event Notification', event.toString());
    this.display.showEvent(event);
  }

  public hasEvents(date: Date): boolean {
    for (const event of this.events.values()) {
      if (event.getDate() === date) return true;
    }
    return false;
  }

  public performConsistencyCheck(message: string /* stringbuffer */): void {}

  public update(): void {
    for (const event of this.events.values()) {
      if (!(event instanceof Meeting)) {
        continue;
      }

      const meeting: Meeting = event as Meeting;

      const note: string = NoteRetriever.get_note(meeting.getDate());
      if (note.length == 0) continue;

      meeting.appendToText(note);
    }
  }

  public getMeeting(date: Date, slot: number): Meeting | null {
    for (const event of this.events.values()) {
      if (!(event instanceof Meeting)) continue;
      const meeting: Meeting = event as Meeting;
      if (meeting.getDate() === date && meeting.getSlot() === slot && !TimeServices.isHoliday(meeting.getDate()))
        return meeting;
    }
    return null;
  }
}
