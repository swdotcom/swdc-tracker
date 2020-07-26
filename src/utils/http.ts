import axios from "axios";

// build the axios api base url
let axiosClient: any = {};

export function setBaseUrl(url: string) {
  axiosClient = axios.create({
    baseURL: url,
    timeout: 15000 // timeout so we're not getting ECONNRESET
  });
}

export async function get(endpoint: string, jwt?: string) {
  if (jwt) {
    axiosClient.defaults.headers.common["Authorization"] = jwt;
  }

  const result = await axiosClient.get(endpoint).catch((e: any) => {
    // we need to catch an error so we're not getting this for example;
    // UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 127.0.0.1:80
    // at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
    return e;
  });
  return result;
}

export async function post(endpoint: string, body: any, jwt: string) {
  axiosClient.defaults.headers.common["Authorization"] = jwt;
  const result = await axiosClient.post(endpoint, body).catch((e: any) => {
    return e;
  });
  return result;
}
