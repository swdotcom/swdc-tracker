

export enum TrackerMode {
  TEST = "test",
  PROD = "prod",
}

export function getTrackerMode(): TrackerMode {
  if (process.env.ENABLE_SWDC_TRACKER === "true") {
    return TrackerMode.PROD;
  }
  return TrackerMode.TEST
}