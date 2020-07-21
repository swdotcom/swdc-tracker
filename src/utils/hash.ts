import { get, post } from "./http";

const _sodium = require('libsodium-wrappers');
let sodium: any;

let userHashedValues: any;

export async function hashValue(value: string, dataType: string, jwt: string) {
  if (!value) {
    return value;
  }

  if (sodium === undefined) {
    Promise.all([setUserHashedValues(jwt), _sodium.ready]).then(() => {
      sodium = _sodium;
    });
  }

  const hashedValue = sodium.to_hex(sodium.crypto_generichash(64, value));

  if (!userHashedValues[dataType].contains(hashedValue)) {
    await encryptValue(value, hashedValue, dataType, jwt);
    // Should we await on this or let it run async?
    setUserHashedValues(jwt);
  }

  return hashedValue
}

async function encryptValue(value: string, hashedValue: string, dataType: string, jwt: string) {
  post("/encypted_user_data", { "value": value, "hashedValue": hashedValue, data_type: dataType }, jwt);
}

async function setUserHashedValues(jwt: string) {
  userHashedValues = await get("/hashed_values", jwt);
}
