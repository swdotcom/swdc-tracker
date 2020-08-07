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

export function getPackageJson(): any {
  try {
    return JSON.parse(fs.readFileSync("package.json", "utf8"));
  } catch (e) {
    console.log("error reading package info", e);
  }
  return null;
}

export function getPackageInfoFromFile(): any {
  const packageJson = getPackageJson();
  if (packageJson) {
    const version = packageJson.version;
    const name = packageJson.name;
    return { name, version };
  }
  // 1.0.21 was the 1st version when this function was introduced
  return { name: "swdc-tracker", version: "1.0.21" };
}
