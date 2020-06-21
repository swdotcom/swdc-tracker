import { getTrackerMode, TrackerMode } from "./env_helper";

export enum TrackerResponseType {
  Success = "success",
  Failed = "failed",
}

export class TrackerResponse {
  status: number = 200;
  state: TrackerResponseType = TrackerResponseType.Success;
  mode: TrackerMode = getTrackerMode();
  message: string = "";
  data: any = {};
  error: any = {};
}

export function success(status = 200, data: any = null): TrackerResponse {
  return buildResponse(status, data);
}

export function error(status = 500, message: string = ""): TrackerResponse {
  return buildResponse(status, {}, message);
}

function buildResponse(status: number, data: any = null, message: string = ""): TrackerResponse {
  const resp: TrackerResponse = new TrackerResponse();
  resp.status = status;
  resp.data = data;
  resp.mode = getTrackerMode();
  resp.message = message;
  return resp;
}
