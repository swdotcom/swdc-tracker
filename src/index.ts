import { setBaseUrl, get } from "./utils/http";
import { CodeTimeParams, CodeTime } from "./events/codetime";
import { EditorActionParams, EditorAction } from "./events/editor_action";
import { GitEventParams, GitEvent } from "./events/git_event";
import { success, error, TrackerResponse } from "./utils/response";
import { isTestMode } from "./utils/env_helper";
import { UIInteractionParams, UIInteraction } from "./events/ui_interaction";
import { buildContexts } from "./utils/context_helper";
import { newTracker, buildSelfDescribingEvent } from '@snowplow/node-tracker';
import { VSCodeExtensionEvent, VSCodeExtensionEventParams } from './events/vscode_extension_event';

const hash = require("object-hash");

const swdcTracker = <any>{};

let lastProcessedTestEvent: any = {};

swdcTracker.dispose = () => {
}

swdcTracker.initialize = async (swdcApiHost: string, namespace: string, appId: string, callbackHandler: any = undefined): Promise<TrackerResponse> => {
  try {
    // fetch tracker_api from plugin config
    setBaseUrl(swdcApiHost);
    const result = await get("/api/v1/plugins/config");
    const tracker_api_host = result.data.tracker_api;
    const tracker_url_scheme = result.data.tracker_url_scheme || "https";

    swdcTracker.spTracker = newTracker({
      namespace: namespace,
      appId: appId,
      encodeBase64: false
    }, {
      endpoint: tracker_api_host,
      protocol: tracker_url_scheme,
      eventMethod: "post",
      bufferSize: 1,
      keepalive: true,
      onRequestFailure({ events, status, message, willRetry }, response) {
        console.error(
          `swdc-tracker failed to send event - status: ${status}; message: ${message}; willRetry: ${willRetry}`
        );
      }
    });
    swdcTracker.spTracker.setPlatform('iot');
    swdcTracker.spTracker.setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (!isTestMode()) {
      console.log(`swdc-tracker initialized and ready to send events to ${tracker_api_host}`);
    }

    return success();
  } catch (e: any) {
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

  return await sendEvent(editorActionPayload, contexts);
}

/**
 * @param gitEvent - the GitEvent event extends Repo, Project, UncommittedChange, Auth
 */
swdcTracker.trackGitEvent = async (params: GitEventParams, track_event: boolean = true): Promise<any> => {

  // build the contexts and event payload
  const gitEventPayload: any = new GitEvent(params).buildPayload();
  const contexts: any = await buildContexts(params);

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

  return await sendEvent(uiInteractionPayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param params - the VSCodeExtensionEvent params
 */
swdcTracker.trackVSCodeExtension = async (params: VSCodeExtensionEventParams): Promise<any> => {
  const vscodeExtensionPayload: any = new VSCodeExtensionEvent(params).buildPayload();
  const contexts: any = await buildContexts(params);

  return await sendEvent(vscodeExtensionPayload, contexts);
}

async function sendEvent(event_payload: any, contexts: any): Promise<TrackerResponse> {
  if (isTestMode()) {
    // test mode - console log the event
    return testEvent(event_payload, contexts);
  }

  try {
    swdcTracker.spTracker.track(buildSelfDescribingEvent({event: event_payload}), contexts);
  } catch (e) {
    // We may get IPIPE, or ECONNRESET. Log it.
    console.error("swdc-tracker unstruct track event error", e);
  }

  return success();
}

function buildCompareHash(payload: any) {
  const obj: any = {};

  // build an object with non-undefined values
  Object.keys(payload).forEach(metric => {
    if (payload[metric]) {
      obj[metric] = payload[metric];
    }
  });

  return hash(obj);
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

swdcTracker.getEventDataHash = (eventData: any) => {
  return buildCompareHash(eventData);
}

export default swdcTracker;
export * from "./events/codetime";
export * from "./events/editor_action";
export * from "./events/ui_interaction";
export * from "./events/vscode_extension_event";
export * from "./entities/auth";
export * from "./entities/file";
export * from "./entities/plugin";
export * from "./entities/project";
export * from "./entities/repo";
export * from "./entities/ui_element";
export * from "./entities/vscode_extension";
