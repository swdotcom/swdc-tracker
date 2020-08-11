const pckg = require("../../package.json");

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
  if (pckg) {
    return pckg;
  }

  // unable to import the package json, use defaults
  // 1.0.21 is the version this was introduced
  return {
    name: "swdc-tracker",
    version: "1.0.21"
  };
}
