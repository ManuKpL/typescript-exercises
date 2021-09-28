import { Writable } from 'stream';

export class AddEmployeeCmd {
  name: string;
  address: string;
  city: string;
  state: string;
  yearlySalary: string;

  private static readonly header: Buffer = Buffer.from([0xde, 0xad]);
  private static readonly commandChar: Buffer = Buffer.from([0x02]);
  private static readonly footer: Buffer = Buffer.from([0xbe, 0xef]);
  private static readonly SIZE_LENGTH: number = 1;
  private static readonly CMD_BYTE_LENGTH: number = 1;

  private getSize(): number {
    return (
      AddEmployeeCmd.header.length +
      AddEmployeeCmd.SIZE_LENGTH +
      AddEmployeeCmd.CMD_BYTE_LENGTH +
      AddEmployeeCmd.footer.length +
      (Buffer.from(this.name).length + 1) +
      (Buffer.from(this.address).length + 1) +
      (Buffer.from(this.city).length + 1) +
      (Buffer.from(this.state).length + 1) +
      (Buffer.from(this.yearlySalary).length + 1)
    );
  }

  public constructor(name: string, address: string, city: string, state: string, yearlySalary: number) {
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.yearlySalary = yearlySalary.toString();
  }

  public write(outputStream: Writable): void {
    outputStream.write(AddEmployeeCmd.header);
    outputStream.write(Buffer.from([this.getSize()]));
    outputStream.write(AddEmployeeCmd.commandChar);
    outputStream.write(Buffer.from(this.name));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(Buffer.from(this.address));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(Buffer.from(this.city));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(Buffer.from(this.state));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(Buffer.from(this.yearlySalary));
    outputStream.write(Buffer.from([0x00]));
    outputStream.write(AddEmployeeCmd.footer);
  }
}
