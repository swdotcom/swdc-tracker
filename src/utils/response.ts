import { getTrackerMode, TrackerMode } from "./env_helper";

export class TrackerResponse {
  status: number = 200;
  mode: TrackerMode = getTrackerMode();
  message: string = "";
  error: any = {};
  body: any = {};
}

export function success(status: number = 200): TrackerResponse {
  return buildResponse(status);
}

export function error(status: number = 500, error: {}, message: string = ""): TrackerResponse {
  return buildResponse(status, message, error);
}

function buildResponse(status: number, message: string = "", error: any = {}): TrackerResponse {
  const resp: TrackerResponse = new TrackerResponse();
  resp.status = status;
  resp.mode = getTrackerMode();
  resp.message = message;
  resp.error = error;
  return resp;
}
