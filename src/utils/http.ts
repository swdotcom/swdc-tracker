import axios from "axios";
let baseURL = "";

export function setBaseUrl(baseURL: string) {
  baseURL = baseURL;
}

export async function get(endpoint: string, jwt?: string) {
  const api = axios.create({ baseURL: baseURL, headers: { "Authorization": jwt }});
  const result = await api.get(endpoint);
  return result;
}

export async function post(endpoint: string, body: any, jwt: string) {
  const api = axios.create({ baseURL: baseURL, headers: { "Authorization": jwt }});

  const result = await api.post(endpoint, body);
  return result;
}
