export class MailService {
  private static instance: MailService;

  private constructor() {}

  public static getInstance(): MailService {
    if (this.instance == null) this.instance = new MailService();
    return this.instance;
  }

  public sendMail(address: string, subject: string, message: string): void {
    // this method really sends mail
  }
}
