import { get, post } from "./http";

const _sodium = require('libsodium-wrappers');
let sodium: any;

let userHashedValues: any = {};

export async function hashValue(value: string, dataType: string, jwt?: string) {
  if (!jwt) {
    return ""
  }

  if (!value) {
    return value;
  }

  if (sodium === undefined) {
    await Promise.all([setUserHashedValues(jwt), _sodium.ready]).then(() => {
      sodium = _sodium;
    });
  }

  const hashedValue = sodium.to_hex(sodium.crypto_generichash(64, value));

  await encryptValue(value, hashedValue, dataType, jwt);

  return hashedValue;
}

async function encryptValue(value: string, hashedValue: string, dataType: string, jwt?: string) {
  if (!jwt) {
    return ""
  }

  const hashValueAlreadyExists = !!userHashedValues[dataType] && userHashedValues[dataType].includes(hashedValue);

  if(!hashValueAlreadyExists) {
    const params = {
      value: value,
      hashed_value: hashedValue,
      data_type: dataType
    }

    const response =  await post("/user_encrypted_data", params, jwt);

    if(response.status == 201) {
      // update the local userHashedValues so that we don't re-encrypt it
      if(userHashedValues[dataType]) {
        userHashedValues[dataType].push(hashedValue);
      } else {
        userHashedValues[dataType] = [hashedValue]
      }
    }

    setUserHashedValues(jwt);
  }
}

async function setUserHashedValues(jwt: string) {
  const response = await get("/hashed_values", jwt);
  userHashedValues = response.data;
}
