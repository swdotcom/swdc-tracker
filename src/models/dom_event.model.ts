import { EventMeta } from "./event_meta.model";
import { TimeInfo } from "./time_info.model";
import { Plugin } from "./plugin.model";

// DataEvent interface for the data event payload
// extends from event meta, plugin, and time info
export interface DomEvent extends EventMeta, Plugin, TimeInfo {
  hostname: string,
}

export async function domEventPayload(params: DomEvent) {
  return {
    schema: "iglu:com.software/dom_event/jsonschema/1-0-0",
    data: {
      ...params
    }
  }
}