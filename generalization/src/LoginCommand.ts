import { Writable } from 'stream';

export class LoginCommand {
  private userName: string;
  private passwd: string;
  private static readonly header: Buffer = Buffer.from([0xde, 0xad]);
  private static readonly commandChar: Buffer = Buffer.from([0x01]);
  private static readonly footer: Buffer = Buffer.from([0xbe, 0xef]);
  private static readonly SIZE_LENGTH: number = 1;
  private static readonly CMD_BYTE_LENGTH: number = 1;

  public constructor(userName: string, passwd: string) {
    this.userName = userName;
    this.passwd = passwd;
  }

  private getSize(): number {
    return (
      LoginCommand.header.length +
      LoginCommand.SIZE_LENGTH +
      LoginCommand.CMD_BYTE_LENGTH +
      LoginCommand.footer.length +
      (Buffer.from(this.userName).length + 1) +
      (Buffer.from(this.passwd).length + 1)
    );
  }

  public write(outputStream: Writable): void {
    outputStream.write(LoginCommand.header);
    outputStream.write(Buffer.from([this.getSize()]));
    outputStream.write(LoginCommand.commandChar);
    outputStream.write(Buffer.from(this.userName));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(Buffer.from(this.passwd));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(LoginCommand.footer);
  }
}
