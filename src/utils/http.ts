import axios from "axios";

// build the axios api base url
let axiosClient: any = {};

export function setBaseUrl(url: string) {
  axiosClient = axios.create({
    baseURL: url,
    timeout: 15000 // timeout so we're not getting ECONNRESET
  });

  // set teh tracker version and ID
  let version = process.env.npm_package_version;
  let name = process.env.npm_package_name;
  if (!version) {
    const fs = require("fs");
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    version = packageJson.version;
    name = packageJson.name;
  }
  axiosClient.defaults.headers.common["X-SWDC-Tracker-Version"] = version || "";
  axiosClient.defaults.headers.common["X-SWDC-Tracker-Id"] = name || "swdc-tracker";
}

export async function get(endpoint: string, jwt?: string) {
  if (jwt) {
    axiosClient.defaults.headers.common["Authorization"] = jwt;
  }

  const result = await axiosClient.get(endpoint).catch((e: any) => {
    // we need to catch an error so we're not getting this for example;
    // UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 127.0.0.1:80
    // at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
    const msg = e.message || e.code;
    console.log("swdc-tracker get request error", msg);
    return e;
  });
  return result;
}

export async function post(endpoint: string, body: any, jwt: string) {
  axiosClient.defaults.headers.common["Authorization"] = jwt;
  const result = await axiosClient.post(endpoint, body).catch((e: any) => {
    const msg = e.message || e.code;
    console.log("swdc-tracker post request error", msg);
    return e;
  });
  return result;
}
