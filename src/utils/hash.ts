const _sodium = require('libsodium-wrappers');

let sodium: any;

export async function hashValue(value: string) {
  if (!value) {
    return value;
  }

  if (sodium === undefined) {
    await _sodium.ready;
    sodium = _sodium
  }

  const result = sodium.crypto_generichash(64, value);
  return sodium.to_hex(result);
}
