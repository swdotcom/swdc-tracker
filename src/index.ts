import { get } from "./utils/http";
import {
  filePayload,
  projectPayload,
  pluginPayload,
  repoPayload,
  authPayload
} from './utils/data_structures';

const snowplow = require('snowplow-tracker');
const emitter = snowplow.emitter;
const tracker = snowplow.tracker;
const swdcTracker = <any>{}

swdcTracker.initialize = async (swdcApiHost: string, namespace: string, appId: string) => {
  try {
    // fetch tracker_api from plugin config 
    const result = await get(swdcApiHost, "/plugins/config")
    const tracker_api_host = result.data.tracker_api

    // initialize snowplow tracker
    const e = emitter(tracker_api_host)

    swdcTracker.spTracker = tracker([e], namespace, appId, false)

    if(process.env.ENABLE_SWDC_TRACKER === "true") {
      swdcTracker.testMode = false
      console.log(`swdc-tracker initialized and ready to send events to ${tracker_api_host}`)
    } else {
      swdcTracker.testMode = true
      console.log('swdc-tracker test mode on. set env ENABLE_SWDC_TRACKER to "true" to send events')
    }
  } catch(e) {
    console.log("swdcTracker failed to initialize", e)
  }
};

interface EditorActionParams {
  jwt: string,
  entity: string, 
  type: string, 
  tz_offset_minutes: number,
  file_name: string,
  file_path: string,
  file_syntax: string,
  file_line_count: number,
  file_character_count: number,
  project_name: string,
  project_directory: string,
  plugin_id: number,
  plugin_version: string
}

swdcTracker.trackEditorAction = async ({
  jwt,
  entity, 
  type, 
  tz_offset_minutes,
  file_name,
  file_path,
  file_syntax,
  file_line_count,
  file_character_count,
  project_name,
  project_directory,
  plugin_id,
  plugin_version
}: EditorActionParams) => {
  const properties = {
    schema: "iglu:com.software/editor_action/jsonschema/1-0-0",
    data: {
      entity: entity,
      type: type,
      tz_offset_minutes: tz_offset_minutes
    }
  }

  const _filePayload = await filePayload(file_name, file_path, file_syntax, file_line_count, file_character_count);
  const _projectPayload = await projectPayload(project_name, project_directory);

  const contexts = [
    authPayload(jwt),
    _filePayload,
    _projectPayload,
    pluginPayload(plugin_id, plugin_version)
  ]

  if(swdcTracker.testMode){
    testEvent(properties, contexts)
  } else {
    swdcTracker.spTracker.trackUnstructEvent(properties, contexts)
  }
}

interface CodetimeParams {
  jwt: string,
  keystrokes: number, 
  chars_added: number,
  chars_deleted: number,
  chars_pasted: number,
  pastes: number,
  lines_added: number,
  lines_deleted: number,
  start_time: string, // UTC start timestamp in rfc 3339 format
  end_time: string, // UTC end timestamp inrfc 3339 format 
  tz_offset_minutes: number,
  file_name: string,
  file_path: string,
  file_syntax: string,
  file_line_count: number,
  file_character_count: number,
  project_name: string,
  project_directory: string,
  plugin_id: number,
  plugin_version: string,
  repo_identifier: string,
  repo_name: string,
  repo_owner_id: string,
  repo_git_branch: string,
  repo_git_tag: string
}

swdcTracker.trackCodetime = ({
  jwt,
  keystrokes, 
  chars_added,
  chars_deleted,
  chars_pasted,
  pastes,
  lines_added,
  lines_deleted,
  start_time, // UTC start timestamp in rfc 3339 format
  end_time, // UTC end timestamp inrfc 3339 format 
  tz_offset_minutes,
  file_name,
  file_path,
  file_syntax,
  file_line_count,
  file_character_count,
  project_name,
  project_directory,
  plugin_id,
  plugin_version,
  repo_identifier,
  repo_name,
  repo_owner_id,
  repo_git_branch,
  repo_git_tag
}: CodetimeParams) => {
  const properties = {
    schema: "iglu:com.software/codetime/jsonschema/1-0-0",
    data: {
      keystrokes: keystrokes,
      chars_added: chars_added,
      chars_deleted: chars_deleted,
      chars_pasted: chars_pasted,
      pastes: pastes,
      lined_added: lines_added,
      lined_deleted: lines_deleted,
      start_time: start_time,
      end_time: end_time,
      tz_offset_minutes: tz_offset_minutes
    }
  }

  const _filePayload = filePayload(file_name, file_path, file_syntax, file_line_count, file_character_count)
  const _projectPayload = projectPayload(project_name, project_directory)
  const _repoPayload = repoPayload(repo_identifier, repo_name, repo_owner_id, repo_git_branch, repo_git_tag)

  const contexts = [
    authPayload(jwt),
    _filePayload,
    _projectPayload,
    pluginPayload(plugin_id, plugin_version),
    _repoPayload
  ]

  if(swdcTracker.testMode){
    testEvent(properties, contexts)
  } else {
    swdcTracker.spTracker.trackUnstructEvent(properties, contexts)
  }
}

function testEvent(properties: any, contexts: any): void {
  const event = {
    properties: properties,
    contexts: contexts
  }
  console.log("swdc-tracker test mode on. trackUnstructEvent was called with the following payload: ", event)
}

export default swdcTracker;