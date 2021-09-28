import { Transform } from 'stream';

export function makeOutputStream() {
  const outputStream = new Transform();
  outputStream._transform = function (chunk, _encoding, done) {
    this.push(chunk);
    done();
  };
  return outputStream;
}
