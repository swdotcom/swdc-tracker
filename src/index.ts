import axios from "axios";
const snowplow = require('snowplow-tracker');
const emitter = snowplow.emitter;
const tracker = snowplow.tracker;

const swdcTracker = <any>{}

swdcTracker.initialize = async (swdcApiHost: string, namespace: string, appId: string) => {
  try {
    // fetch tracker_api from plugin config 
    const api = axios.create({ baseURL: swdcApiHost })
    const result = await api.get("/plugins/config")
    const tracker_api_host = result.data.tracker_api

    // initialize snowplow tracker
    const e = emitter(tracker_api_host)
    swdcTracker.spTracker = tracker([e], namespace, appId, false)

    swdcTracker.trackEditorAction("editor", "activate", null)
  } catch(e) {
    // TODO: how should we handle this failing?
    console.log(e)
  }
};

swdcTracker.trackEditorAction = (entity: string, type: string, tz_offset_minutes?: number) => {
	swdcTracker.spTracker.trackUnstructEvent({
		schema: "iglu:com.software/editor_action/jsonschema/1-0-0",
		data: {
			entity: entity,
			type: type,
			tz_offset_minutes: tz_offset_minutes
		}
	})
}


export default swdcTracker;