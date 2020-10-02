import { setBaseUrl, get } from "./utils/http";
import { CodeTimeParams, CodeTime } from "./events/codetime";
import { EditorActionParams, EditorAction } from "./events/editor_action";
import { success, error, TrackerResponse } from "./utils/response";
import { isTestMode } from "./utils/env_helper";
import { UIInteractionParams, UIInteraction } from "./events/ui_interaction";
import { buildContexts } from "./utils/context_helper";

const snowplow = require("snowplow-tracker");
const emitter = snowplow.emitter;
const tracker = snowplow.tracker;
const swdcTracker = <any>{};

let lastProcessedTestEvent: any = {};

swdcTracker.initialize = async (swdcApiHost: string, namespace: string, appId: string): Promise<TrackerResponse> => {
  try {
    // fetch tracker_api from plugin config
    setBaseUrl(swdcApiHost);
    const result = await get("/plugins/config");
    const tracker_api_host = result.data.tracker_api;
    const tracker_url_scheme = result.data.tracker_url_scheme || "https";
    // initialize snowplow tracker
    // endpoint, protocol, optional port, method, buffer events, request callback
    const e = emitter(tracker_api_host, tracker_url_scheme, null, "post", 0, function (error: any, body: any, response: any) {
      if (error) {
        console.log("swdc-tracker collector stream error", error);
      }
    });

    swdcTracker.spTracker = tracker([e], namespace, appId, false)
    swdcTracker.spTracker.setPlatform('iot');
    swdcTracker.spTracker.setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (isTestMode()) {
      console.log('swdc-tracker test mode on. set env ENABLE_SWDC_TRACKER to "true" to send events');
    } else {
      console.log(`swdc-tracker initialized and ready to send events to ${tracker_api_host}`);
    }

    return success();
  } catch (e) {
    return error(500, `Failed to initialize. ${e.message}`);
  }
};

/**
 * @param codetimeEvent - the CodeTime event extends Repo, Project, File, Auth
 */
swdcTracker.trackCodeTimeEvent = async (params: CodeTimeParams): Promise<any> => {

  // build the contexts and event payload
  const _codetimePayload: any = await new CodeTime(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(_codetimePayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param editorActionEvent - the DomEvent properties (extends plugin, event_meta, and time_info)
 */
swdcTracker.trackEditorAction = async (params: EditorActionParams): Promise<any> => {

  // build the contexts and event payload
  const _editorActionPayload: any = await new EditorAction(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(_editorActionPayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param params - the UI Interaction params
 */
swdcTracker.trackUIInteraction = async (params: UIInteractionParams): Promise<any> => {

  // build the contexts and event payload
  const _uiInteractionPayload: any = await new UIInteraction(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(_uiInteractionPayload, contexts);
}

async function sendEvent(event_payload: any, contexts: any): Promise<TrackerResponse> {
  if (isTestMode()) {
    // test mode - console log the event
    return testEvent(event_payload, contexts);
  }

  try {
    /**
     * trackUnstructEvent takes the following:
     * properties => json of {schema, data} (required)
     * context => list of event contexts (optional)
     * tstamp => positive integer (optional)
     */
    // The track logic is not async, no need to have an await,
    // "track()" will perform a callback on the payload data but does not return
    // a promise based on that.
    // "function track(sb: PayloadData, context?: Array<SelfDescribingJson>, tstamp?: Timestamp): PayloadData {"
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
