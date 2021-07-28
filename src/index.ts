import { setBaseUrl, get } from "./utils/http";
import { CodeTimeParams, CodeTime, codetime_schema } from "./events/codetime";
import { EditorActionParams, EditorAction } from "./events/editor_action";
import { GitEventParams, GitEvent, git_schema } from "./events/git_event";
import { success, error, TrackerResponse } from "./utils/response";
import { isTestMode } from "./utils/env_helper";
import { UIInteractionParams, UIInteraction, ui_interaction_schema } from "./events/ui_interaction";
import { buildContexts } from "./utils/context_helper";

const hash = require("object-hash");

const snowplow = require("snowplow-tracker");
const emitter = snowplow.emitter;
const tracker = snowplow.tracker;
const swdcTracker = <any>{};
const ONE_HOUR_MILLIS = 1000 * 60 * 60;

let lastProcessedTestEvent: any = {};
const outgoingEventMap: any = {
  codetime_event: {},
  editor_action_event: {},
  ui_interaction_event: {},
  git_event: {}
};

let pendingEventTimer: any = undefined;

const outgoingEventReconciler = (body: any) => {
  if (body && Object.keys(body).length) {
    try {
      const schema_body = JSON.parse(body.request.body);
      // find the codetime schema
      const schema_data = schema_body?.data.find((schema_metadata:any) => schema_metadata.ue_pr.includes("iglu:com.software/"));
      if (schema_data) {
        const event_obj = JSON.parse(schema_data.ue_pr);

        // match the hash in the map then remove if found
        const payloadHash = hash(event_obj.data);

        // found an outgoing event
        // default to the event that happens the most
        let event_key = "editor_action_event";
        if (schema_data.ue_pr.includes(codetime_schema)) {
          event_key = "codetime_event";
        } else if (schema_data.ue_pr.includes(ui_interaction_schema)) {
          event_key = "ui_interaction_event";
        } else if (schema_data.ue_pr.includes(git_schema)) {
          event_key = "git_event";
        }

        const outgoingPayload = outgoingEventMap[event_key][payloadHash];
        if (outgoingPayload) {
          // remove this event from the map
          delete outgoingEventMap[event_key][payloadHash];
        }
      }

    } catch (e) {
      console.error("Error parsing tracker result. ", e.message);
    }
  }
}

const sendPendingCodeTimeEvents = () => {
  if (outgoingEventMap) {
    Object.keys(outgoingEventMap).forEach(event_key => {
      const eventsMap: any = outgoingEventMap[event_key];
      if (eventsMap && Object.keys(eventsMap).length) {
        Object.keys(eventsMap).forEach(hash_key => {
          const params = eventsMap[hash_key];
          if (params) {
            if (event_key === "editor_action_event") {
              swdcTracker.trackEditorAction(params, false);
            } else if (event_key === "codetime_event") {
              swdcTracker.trackCodeTimeEvent(params, false);
            } else if (event_key === "ui_interaction_event") {
              swdcTracker.trackUIInteraction(params, false);
            } else if (event_key === "git_event") {
              swdcTracker.trackGitEvent(params, false);
            }
            delete eventsMap[hash_key];
          }
        });
      }
    });
  }
}

swdcTracker.dispose = () => {
  if (pendingEventTimer) {
    clearInterval(pendingEventTimer);
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
        console.error(errMsg);
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

    pendingEventTimer = setInterval(() => {
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
swdcTracker.trackCodeTimeEvent = async (params: CodeTimeParams, track_event: boolean = true): Promise<any> => {

  // build the contexts and event payload
  const codetimePayload: any = new CodeTime(params).buildPayload();
  const contexts: any = await buildContexts(params);

  if (track_event) {
    const payloadHash = hash(codetimePayload);
    outgoingEventMap["codetime_event"][payloadHash] = params;
  }

  return await sendEvent(codetimePayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param editorActionEvent - the DomEvent properties (extends plugin, event_meta, and time_info)
 */
swdcTracker.trackEditorAction = async (params: EditorActionParams, track_event: boolean = true): Promise<any> => {

  // build the contexts and event payload
  const editorActionPayload: any = new EditorAction(params).buildPayload();
  const contexts: any = await buildContexts(params);

  if (track_event) {
    const payloadHash = hash(editorActionPayload);
    outgoingEventMap["editor_action_event"][payloadHash] = params;
  }

  return await sendEvent(editorActionPayload, contexts);
}

/**
 * @param gitEvent - the GitEvent event extends Repo, Project, UncommittedChange, Auth
 */
swdcTracker.trackGitEvent = async (params: GitEventParams, track_event: boolean = true): Promise<any> => {

  // build the contexts and event payload
  const gitEventPayload: any = new GitEvent(params).buildPayload();
  const contexts: any = await buildContexts(params);

  if (track_event) {
    const payloadHash = hash(gitEventPayload);
    outgoingEventMap["git_event"][payloadHash] = params;
  }

  return await sendEvent(gitEventPayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param params - the UI Interaction params
 */
swdcTracker.trackUIInteraction = async (params: UIInteractionParams, track_event: boolean = true): Promise<any> => {

  // build the contexts and event payload
  const uiInteractionPayload: any = new UIInteraction(params).buildPayload();
  const contexts: any = await buildContexts(params);

  if (track_event) {
    const payloadHash = hash(uiInteractionPayload);
    outgoingEventMap["ui_interaction_event"][payloadHash] = params;
  }

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
    console.error("swdc-tracker unstruct track event error", e);
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

swdcTracker.updateOutgoingParamsData = (event_key: string, hash: string, params: any): any => {
  return outgoingEventMap[event_key][hash] = params;
}

swdcTracker.getOutgoingParamsData = (event_key: string, hash: string): any => {
  return outgoingEventMap[event_key][hash];
}

swdcTracker.sendOutgoingParamsData = () => {
  sendPendingCodeTimeEvents();
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
