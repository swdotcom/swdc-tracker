import { get } from "./utils/http";
import { CodeTimeParams, CodeTime } from "./events/codetime";
import { EditorActionParams, EditorAction } from "./events/editor_action";
import { Auth } from "./entities/auth";
import { Project } from "./entities/project";
import { Repo } from "./entities/repo";
import { File } from "./entities/file";
import { Plugin } from "./entities/plugin";
import { success, error, TrackerResponse } from "./utils/response";
import { isTestMode } from "./utils/env_helper";

const snowplow = require("snowplow-tracker");

const emitter = snowplow.emitter;
const tracker = snowplow.tracker;
const swdcTracker = <any>{};

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
    console.log("swdcTracker failed to initialize", e);
    return error(500, `Failed to initialize. ${e.message}`);
  }
};

/**
 * @param jwt - the authorization token
 * @param codetimeEvent - the CodeTime event extends Repo, Project, File 
 */
swdcTracker.trackCodeTimeEvent = async (params: CodeTimeParams): Promise<any> => {

  // build the strict types
  // code time
  const codetime: CodeTime = new CodeTime(params);
  // project
  const project: Project = new Project(params);
  // repo
  const repo: Repo = new Repo(params);
  // file
  const file: File = new File(params);
  // plugin
  const plugin: Plugin = new Plugin(params);
  // auth
  const auth: Auth = new Auth(params);

  // create the payloads
  const _codetimePayload = await codetime.buildPayload();
  const _projecPayload = await project.buildPayload();
  const _repoPayload = await repo.buildPayload();
  const _filePayload = await file.buildPayload();
  const _pluginPayload = await plugin.buildPayload();
  const _authPayload = await auth.buildPayload();

  // crate the context with the authorization info
  const contexts = [
    _authPayload,
    _codetimePayload,
    _projecPayload,
    _repoPayload,
    _filePayload,
    _pluginPayload
  ]

  if (isTestMode()) {
    // test mode - console log the event
    return testEvent(_codetimePayload, contexts)
  }

  // track the event.
  // trackUnstrucEvent returns...
  // {add <func(key, val)>, addDict <func(dict)>, addJson <func(keyIfEncoded, keyIfNotEncoded, json)>, build <func()>}
  return await swdcTracker.spTracker.trackUnstructEvent(_codetimePayload, contexts);
}

/**
 * @param jwt - the authorization token
 * @param editorActionEvent - the DomEvent properties (extends plugin, event_meta, and time_info)
 */
swdcTracker.trackEditorAction = async (params: EditorActionParams): Promise<any> => {

  // build the strict types
  const editorAction: EditorAction = new EditorAction(params);
  // plugin
  const plugin: Plugin = new Plugin(params);
  // file
  const file: File = new File(params);
  // project
  const project: Project = new Project(params);
  // auth
  const auth: Auth = new Auth(params);

  // create the payload
  const _editorActionPayload = await editorAction.buildPayload();
  const _projecPayload = await project.buildPayload();
  const _filePayload = await file.buildPayload();
  const _pluginPayload = await plugin.buildPayload();
  const _authPayload = await auth.buildPayload();

  // crate the context with the authorization info
  const contexts = [
    _authPayload,
    _editorActionPayload,
    _pluginPayload,
    _filePayload,
    _projecPayload
  ]

  if (isTestMode()) {
    // test mode - console log the event
    return testEvent(_editorActionPayload, contexts)
  }

  // track the event.
  // trackUnstrucEvent returns...
  // {add <func(key, val)>, addDict <func(dict)>, addJson <func(keyIfEncoded, keyIfNotEncoded, json)>, build <func()>}
  return await swdcTracker.spTracker.trackUnstructEvent(_editorActionPayload, contexts);
}

function testEvent(properties: any, contexts: any): TrackerResponse {
  const event = {
    properties: properties,
    contexts: contexts
  };

  if (!process.env.DISABLE_SWDC_TRACKER_LOGGING) {
    console.log("swdc-tracker test mode on. trackUnstructEvent was called with the following payload: ", event);
  }
  return success(200, event);
}

export default swdcTracker;