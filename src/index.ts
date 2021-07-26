import { setBaseUrl, get } from "./utils/http";
import { CodeTimeParams, CodeTime } from "./events/codetime";
import { EditorActionParams, EditorAction } from "./events/editor_action";
import { GitEventParams, GitEvent } from "./events/git_event";
import { success, error, TrackerResponse } from "./utils/response";
import { isTestMode } from "./utils/env_helper";
import { UIInteractionParams, UIInteraction } from "./events/ui_interaction";
import { buildContexts } from "./utils/context_helper";

const hash = require("object-hash");

const snowplow = require("snowplow-tracker");
const emitter = snowplow.emitter;
const tracker = snowplow.tracker;
const swdcTracker = <any>{};
const ONE_HOUR_MILLIS = 1000 * 60 * 60;

let lastProcessedTestEvent: any = {};
let outgoingCodetimeEventMap: any = {};
let pendingCodetimeEventTimer: any = undefined;

const outgoingEventReconciler = (body: any) => {
  if (body && Object.keys(body).length) {
    try {
      const payload = JSON.parse(body.request.body);
      // find the codetime schema
      const ctPayload = payload?.data.find((n:any) => n.ue_pr.includes("com.software/codetime"));
      if (ctPayload) {
        const schmema = JSON.parse(ctPayload.ue_pr);
        // match the hash in the map then remove if found
        const ctPayloadHash = hash(schmema.data);
        const outgoingPayload = swdcTracker.getOutgoingCodeTimeParams(ctPayloadHash);
        if (outgoingPayload) {
          // remove this event from the map
          delete outgoingCodetimeEventMap[ctPayloadHash];
        }
      }
    } catch (e) {
      console.error("Error parsing tracker result. ", e.message);
    }
  }
}

const sendPendingCodeTimeEvents = () => {
  if (outgoingCodetimeEventMap) {
    Object.keys(outgoingCodetimeEventMap).forEach(key => {
      const codetimeParams: any = outgoingCodetimeEventMap[key];
      swdcTracker.trackCodeTimeEvent(codetimeParams);
    });
  }
}

swdcTracker.dispose = () => {
  if (pendingCodetimeEventTimer) {
    clearInterval(pendingCodetimeEventTimer);
  }
}

swdcTracker.initialize = async (swdcApiHost: string, namespace: string, appId: string, callbackHandler: any = undefined): Promise<TrackerResponse> => {
  try {
    // fetch tracker_api from plugin config
    setBaseUrl(swdcApiHost);
    const result = await get("/plugins/config");
    const tracker_api_host = result.data.tracker_api;
    const tracker_url_scheme = result.data.tracker_url_scheme || "https";
    // initialize snowplow tracker
    // endpoint, protocol, optional port, method, buffer events, request callback
    const e = emitter(tracker_api_host, tracker_url_scheme, null, "post", 0, function (err: any, body: any, response: any) {
      let resp: any;
      if (err) {
        const errMsg = `swdc-tracker event error. ${err.message}`;
        console.log(errMsg);
        // send the error response with the orig body data
        resp = error(500, err, errMsg);
      } else {
        resp = success();
      }

      if (callbackHandler) {
        resp.body = body;
        callbackHandler(resp);
      }

      outgoingEventReconciler(body);
    });

    swdcTracker.spTracker = tracker([e], namespace, appId, false)
    swdcTracker.spTracker.setPlatform('iot');
    swdcTracker.spTracker.setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (!isTestMode()) {
      console.log(`swdc-tracker initialized and ready to send events to ${tracker_api_host}`);
    }

    pendingCodetimeEventTimer = setInterval(() => {
      sendPendingCodeTimeEvents();
    }, ONE_HOUR_MILLIS);

    return success();
  } catch (e) {
    return error(500, e, `Failed to initialize. ${e.message}`);
  }
};

/**
 * @param codetimeEvent - the CodeTime event extends Repo, Project, File, Auth
 */
swdcTracker.trackCodeTimeEvent = async (params: CodeTimeParams): Promise<any> => {

  // build the contexts and event payload
  const codetimePayload: any = new CodeTime(params).buildPayload();
  const contexts: any = await buildContexts(params);

  const payloadHash = hash(codetimePayload);
  outgoingCodetimeEventMap[payloadHash] = params;

  return await sendEvent(codetimePayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param editorActionEvent - the DomEvent properties (extends plugin, event_meta, and time_info)
 */
swdcTracker.trackEditorAction = async (params: EditorActionParams): Promise<any> => {

  // build the contexts and event payload
  const editorActionPayload: any = new EditorAction(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(editorActionPayload, contexts);
}

/**
 * @param gitEvent - the GitEvent event extends Repo, Project, UncommittedChange, Auth
 */
swdcTracker.trackGitEvent = async (params: GitEventParams): Promise<any> => {

  // build the contexts and event payload
  const gitEventPayload: any = new GitEvent(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(gitEventPayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param params - the UI Interaction params
 */
swdcTracker.trackUIInteraction = async (params: UIInteractionParams): Promise<any> => {

  // build the contexts and event payload
  const uiInteractionPayload: any = new UIInteraction(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(uiInteractionPayload, contexts);
}

async function sendEvent(event_payload: any, contexts: any): Promise<TrackerResponse> {
  if (isTestMode()) {
    // test mode - console log the event
    return testEvent(event_payload, contexts);
  }

  try {
    // use the error callback to handle any errors
    swdcTracker.spTracker.trackUnstructEvent(event_payload, contexts);
  } catch (e) {
    // We may get IPIPE, or ECONNRESET. Log it.
    console.log("swdc-tracker unstruct track event error", e);
  }

  return success();
}

function testEvent(properties: any, contexts: any): TrackerResponse {
  const event = {
    properties: properties,
    contexts: contexts
  };

  lastProcessedTestEvent = event;

  return success();
}

swdcTracker.getLastProcessedTestEvent = (): any => {
  return lastProcessedTestEvent;
}

swdcTracker.getOutgoingCodeTimeParams = (hash: string): any => {
  return outgoingCodetimeEventMap[hash];
}

export default swdcTracker;
export * from "./events/codetime";
export * from "./events/editor_action";
export * from "./events/ui_interaction";
export * from "./entities/auth";
export * from "./entities/file";
export * from "./entities/plugin";
export * from "./entities/project";
export * from "./entities/repo";
export * from "./entities/ui_element";
