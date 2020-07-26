import axios from "axios";

// build the axios api base url
let beApi: any = {};

export function setBaseUrl(url: string) {
  beApi = axios.create({
    baseURL: url,
    timeout: 15000 // timeout so we're not getting ECONNRESET
  });
}

export async function get(endpoint: string, jwt?: string) {
  if (jwt) {
    beApi.defaults.headers.common["Authorization"] = jwt;
  }

  const result = await beApi.get(endpoint).catch((e: any) => {
    // we need to catch an error so we're not getting this for example;
    // UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 127.0.0.1:80
    // at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
    return e;
  });
  return result;
}

export async function post(endpoint: string, body: any, jwt: string) {
  beApi.defaults.headers.common["Authorization"] = jwt;
  const result = await beApi.post(endpoint, body).catch((e: any) => {
    return e;
  });
  return result;
}
