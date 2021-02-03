import { get, post } from "./http";
import { storeHashedValues, getStoredHashedValues } from "../utils/file";

const _sodium = require('libsodium-wrappers');
let sodium: any;

let lastJwt: string = "";

// payload: { value: string, dataType: string}
export async function hashAndEncryptValues(payload: any, jwt: string) {
  if (sodium === undefined) {
    await Promise.resolve(_sodium.ready).then(() => {
      sodium = _sodium;
    });
  }

  // if the jwt is different from the last fetch (different user, or initializing tracker)
  // fetch the hashed values and store them in ~/.software/hashed_values.json
  if(lastJwt !== jwt) {
    await setUserHashedValues(jwt);
    lastJwt = jwt;
  }

  let result: any = {}

  for (const hashPayload of payload) {
    if(hashPayload.value?.length) {
      const hashedValue = sodium.to_hex(sodium.crypto_generichash(64, hashPayload.value));
      const alreadyEncrypted = await hasHashValueInCache(hashPayload.dataType, hashedValue);

      if(!alreadyEncrypted) {
        await encryptValue(hashPayload.value, hashedValue, hashPayload.dataType, jwt)
      }

      result[hashPayload.dataType] = hashedValue;
    } else {
      result[hashPayload.dataType] = hashPayload.value;
    }
  };

  return result;
}

export async function hashValue(value: string) {
  if (sodium === undefined) {
    await Promise.resolve(_sodium.ready).then(() => {
      sodium = _sodium;
    });
  }

  return sodium.to_hex(sodium.crypto_generichash(64, value));
}

export async function hasHashValueInCache(dataType: string, hashedValue: string) {
  let userHashedValues = getStoredHashedValues();

  // add dataType to userHashedValues cache if it doesn't already exist
  if(!userHashedValues[dataType]) {
    userHashedValues[dataType] = []
  }

  const hasValue = userHashedValues[dataType].includes(hashedValue);

  // if it does not have the value, add it
  if(!hasValue) {
    userHashedValues[dataType].push(hashedValue)
    storeHashedValues(userHashedValues);
  }

  // return the result of hasValue
  return hasValue
}

async function encryptValue(value: string, hashedValue: string, dataType: string, jwt: string) {
  const params = {
    value: value,
    hashed_value: hashedValue,
    data_type: dataType
  }

  await post("/user_encrypted_data", params, jwt);
}

export async function setUserHashedValues(jwt: string) {
  const response = await get("/hashed_values", jwt);
  const hashed_values = response.data;
  await storeHashedValues(hashed_values);
}
