// The plugin entity
export interface Plugin {
  plugin_id: number,
  plugin_version: string,
  plugin_name: string
}

export class PluginImpl implements Plugin {
  public plugin_id: number;
  public plugin_version: string;
  public plugin_name: string;

  constructor(params: Plugin) {
    this.plugin_id = params.plugin_id;
    this.plugin_version = params.plugin_version;
    this.plugin_name = params.plugin_name;
  }
}

export async function buildPluginPayload(plugin: Plugin) {
  return {
    schema: "iglu:com.software/plugin/jsonschema/1-0-0",
    data: {
      ...plugin
    }
  }
}