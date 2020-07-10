const blake3 = require('blake3');

export function hashValue(value: string) {
  if (!value) {
    return value;
  }

  return blake3.hash(value, { length: 64 }).toString('hex');
}
