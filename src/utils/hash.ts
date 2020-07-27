import { get, post } from "./http";

const _sodium = require('libsodium-wrappers');
let sodium: any;

let userHashedValues: any;

export async function hashValue(value: string, dataType: string, jwt: string) {
  if (!value) {
    return value;
  }

  if (sodium === undefined) {
    await Promise.all([setUserHashedValues(jwt), _sodium.ready]).then(() => {
      sodium = _sodium;
    });
  }

  const hashedValue = sodium.to_hex(sodium.crypto_generichash(64, value));

  const hashValueAlreadyExists = !!userHashedValues[dataType] && userHashedValues[dataType].includes(hashedValue);

  if (!hashValueAlreadyExists) {
    await encryptValue(value, hashedValue, dataType, jwt);
    setUserHashedValues(jwt);
  }

  return hashedValue;
}

async function encryptValue(value: string, hashedValue: string, dataType: string, jwt: string) {
  const params = {
    value: value,
    hashed_value: hashedValue,
    data_type: dataType
  }

  post("/user_encrypted_data", params, jwt);
}

async function setUserHashedValues(jwt: string) {
  const response = await get("/hashed_values", jwt);
  userHashedValues = response.data;
}
