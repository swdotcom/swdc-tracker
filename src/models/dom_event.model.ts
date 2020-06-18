// DataEvent interface for the data event payload
export interface DomEvent {
  type: string,
  name: string,
  description: string,
  timestamp: number,
  timestamp_local: number,
  tz_offset_minutes: number,
  pluginId: number,
  os: string,
  version: string,
  hostname: string,
  timezone: string
}

export async function domEventPayload(params: DomEvent) {
  return {
    schema: "iglu:com.software/dom_event/jsonschema/1-0-0",
    data: {
      ...params
    }
  }
}