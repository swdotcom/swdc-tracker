import axios from "axios";

let baseURL = "";

export function setBaseUrl(url: string) {
  baseURL = url;
}

export async function get(endpoint: string, jwt?: string) {
  let apiParams;

  if(jwt) {
    apiParams = { baseURL: baseURL, headers: { "Authorization": jwt }}
  } else {
    apiParams = { baseURL: baseURL }
  }

  const api = axios.create(apiParams);
  const result = await api.get(endpoint);
  return result;
}

export async function post(endpoint: string, body: any, jwt: string) {
  const api = axios.create({ baseURL: baseURL, headers: { "Authorization": jwt }});

  const result = await api.post(endpoint, body);
  return result;
}
