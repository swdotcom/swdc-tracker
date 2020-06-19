import { get } from "./utils/http";
import { buildCodeTimePayload, CodeTimeParams, CodeTimeImpl } from "./events/codetime";
import { buildEditorActionPayload, EditorActionParams, EditorActionImpl } from "./events/editor_action";
import { buildAuthPayload } from "./entities/auth";
import { buildProjectPayload, ProjectImpl } from "./entities/project";
import { buildRepoPayload, RepoImpl } from "./entities/repo";
import { buildFilePayload, FileImpl } from "./entities/file";
import { buildPluginPayload, PluginImpl } from "./entities/plugin";

const snowplow = require('snowplow-tracker');
const emitter = snowplow.emitter;
const tracker = snowplow.tracker;
const swdcTracker = <any>{};

swdcTracker.initialize = async (swdcApiHost: string, namespace: string, appId: string) => {
  try {
    // fetch tracker_api from plugin config 
    const result = await get(swdcApiHost, "/plugins/config")
    const tracker_api_host = result.data.tracker_api

    // initialize snowplow tracker
    const e = emitter(tracker_api_host)

    swdcTracker.spTracker = tracker([e], namespace, appId, false)

    if (process.env.ENABLE_SWDC_TRACKER === "true") {
      swdcTracker.testMode = false
      console.log(`swdc-tracker initialized and ready to send events to ${tracker_api_host}`)
    } else {
      swdcTracker.testMode = true
      console.log('swdc-tracker test mode on. set env ENABLE_SWDC_TRACKER to "true" to send events')
    }
    return { status: "success" };
  } catch (e) {
    console.log("swdcTracker failed to initialize", e);
    return { status: "failed", message: `Failed to initialize. ${e.message}` };
  }
};

/**
 * @param jwt - the authorization token
 * @param codetimeEvent - the CodeTime event extends Repo, Project, File 
 */
swdcTracker.trackCodeTimeEvent = async (params: CodeTimeParams): Promise<any> => {

  // build the strict types
  // code time
  const codetime: CodeTimeImpl = new CodeTimeImpl(params);
  // project
  const project: ProjectImpl = new ProjectImpl(params);
  // repo
  const repo: RepoImpl = new RepoImpl(params);
  // file
  const file: FileImpl = new FileImpl(params);
  // plugin
  const plugin: PluginImpl = new PluginImpl(params);

  // create the payloads
  const _codetimePayload = await buildCodeTimePayload(codetime);
  const _projecPayload = await buildProjectPayload(project);
  const _repoPayload = await buildRepoPayload(repo);
  const _filePayload = await buildFilePayload(file);
  const _pluginPayload = await buildPluginPayload(plugin);

  // crate the context with the authorization info
  const contexts = [
    buildAuthPayload(params.jwt),
    _codetimePayload,
    _projecPayload,
    _repoPayload,
    _filePayload,
    _pluginPayload
  ]

  if (swdcTracker.testMode) {
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
  const editorAction: EditorActionImpl = new EditorActionImpl(params);
  // plugin
  const plugin: PluginImpl = new PluginImpl(params);
  // file
  const file: FileImpl = new FileImpl(params);
  // project
  const project: ProjectImpl = new ProjectImpl(params);

  // create the payload
  const _editorActionPayload = await buildEditorActionPayload(editorAction);
  const _pluginPayload = await buildPluginPayload(plugin);
  const _filePayload = await buildFilePayload(file);
  const _projecPayload = await buildProjectPayload(project);

  // crate the context with the authorization info
  const contexts = [
    buildAuthPayload(params.jwt),
    _editorActionPayload,
    _pluginPayload,
    _filePayload,
    _projecPayload
  ]

  if (swdcTracker.testMode) {
    // test mode - console log the event
    return testEvent(_editorActionPayload, contexts)
  }

  // track the event.
  // trackUnstrucEvent returns...
  // {add <func(key, val)>, addDict <func(dict)>, addJson <func(keyIfEncoded, keyIfNotEncoded, json)>, build <func()>}
  return await swdcTracker.spTracker.trackUnstructEvent(_editorActionPayload, contexts);
}

function testEvent(properties: any, contexts: any): any {
  const event = {
    properties: properties,
    contexts: contexts
  };

  if (!process.env.DISABLE_SWDC_TRACKER_LOGGING) {
    console.log("swdc-tracker test mode on. trackUnstructEvent was called with the following payload: ", event);
  }
  return event;
}

export default swdcTracker;