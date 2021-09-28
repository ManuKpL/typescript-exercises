import { AddEmployeeCmd } from '../AddEmployeeCmd';
import { LoginCommand } from '../LoginCommand';
import { makeOutputStream } from './makeOutputStream';

describe('Command tests', () => {
  test('login command sent correctly', () => {
    const knownGood: Buffer = Buffer.from([
      ...[0xde, 0xad, 20, 0x01],
      ...Buffer.from('bab'),
      0x00,
      ...Buffer.from('cardinals'),
      0x00,
      ...[0xbe, 0xef],
    ]);

    const cmd = new LoginCommand('bab', 'cardinals');
    const outputStream = makeOutputStream();
    cmd.write(outputStream);
    const result = outputStream.read();

    expect.assertions(knownGood.length);
    for (let i = 0; i < knownGood.length; i++) {
      expect(result[i]).toBe(knownGood[i]);
    }
  });

  test('add employees sent correctly', () => {
    const knownGood: Buffer = Buffer.from([
      ...[0xde, 0xad, 52, 0x02],
      ...Buffer.from('Fred Brooks'),
      0x00,
      ...Buffer.from('123 My House'),
      0x00,
      ...Buffer.from('Springfield'),
      0x00,
      ...Buffer.from('IL'),
      0x00,
      ...Buffer.from('72000'),
      0x00,
      ...[0xbe, 0xef],
    ]);

    const cmd = new AddEmployeeCmd('Fred Brooks', '123 My House', 'Springfield', 'IL', 72000);
    const outputStream = makeOutputStream();
    cmd.write(outputStream);
    const result = outputStream.read();

    expect.assertions(knownGood.length);
    for (let i = 0; i < knownGood.length; i++) {
      expect(result[i]).toBe(knownGood[i]);
    }
  });
});
