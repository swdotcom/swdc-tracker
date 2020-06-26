import { get } from "./utils/http";
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
    const result = await get(swdcApiHost, "/plugins/config")
    const tracker_api_host = result.data.tracker_api

    // initialize snowplow tracker
    const e = emitter(tracker_api_host)

    swdcTracker.spTracker = tracker([e], namespace, appId, false)

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
 * @param jwt - the authorization token
 * @param codetimeEvent - the CodeTime event extends Repo, Project, File 
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

  // trackUnstrucEvent returns a PayloadData type:
  // {add <func(key, val)>, addDict <func(dict)>, addJson <func(keyIfEncoded, keyIfNotEncoded, json)>, build <func()>}
  const eventResult: any = await swdcTracker.spTracker.trackUnstructEvent(event_payload, contexts);

  if (eventResult && eventResult.add) {
    return success();
  }
  return error();
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