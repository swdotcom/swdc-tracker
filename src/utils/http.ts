import axios from "axios";

export async function get(baseURL: string, endpoint: string) {
  const api = axios.create({ baseURL: baseURL });
  const result = await api.get(endpoint);
  return result;
}