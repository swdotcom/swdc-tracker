import { getTrackerMode, TrackerMode } from "./env_helper";

export class TrackerResponse {
  status: number = 200;
  mode: TrackerMode = getTrackerMode();
  message: string = "";
  error: any = {};
}

export function success(status = 200): TrackerResponse {
  return buildResponse(status);
}

export function error(status = 500, message: string = ""): TrackerResponse {
  return buildResponse(status, message);
}

function buildResponse(status: number, message: string = ""): TrackerResponse {
  const resp: TrackerResponse = new TrackerResponse();
  resp.status = status;
  resp.mode = getTrackerMode();
  resp.message = message;
  return resp;
}
