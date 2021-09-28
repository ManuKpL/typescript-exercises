import { HomeGuardView } from './HomeGuardView';

export class TextView implements HomeGuardView {
  public showMessage(message: string): void {
    console.log(message);
  }
}
