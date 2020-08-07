const fs = require("fs");

export enum TrackerMode {
  TEST = "test",
  PROD = "prod",
}

export function getTrackerMode(): TrackerMode {
  if (process.env.NODE_ENV == "test") {
    return TrackerMode.TEST
  }
  return TrackerMode.PROD;
}

export function isTestMode(): boolean {
  return getTrackerMode() === TrackerMode.TEST ? true : false;
}

export function getPackageInfo(): any {
  let version = process.env.npm_package_version;
  let name = process.env.npm_package_name;
  if (!version) {
    const nameVersionInfo = getPackageInfoFromFile();
    name = nameVersionInfo.name;
    version = nameVersionInfo.version;
  }
  return { name, version };
}

export function getPackageInfoFromFile(): any {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const version = packageJson.version;
  const name = packageJson.name;
  return { name, version };
}
