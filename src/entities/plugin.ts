// The plugin entity
export interface PluginInterface {
  plugin_id: number,
  plugin_version: string,
  plugin_name: string
}

export class Plugin implements PluginInterface {
  public plugin_id: number;
  public plugin_version: string;
  public plugin_name: string;

  constructor(data: PluginInterface) {
    this.plugin_id = data.plugin_id;
    this.plugin_version = data.plugin_version;
    this.plugin_name = data.plugin_name;
  }

  static hasData(data: PluginInterface) {
    return data.plugin_id && data.plugin_version;
  }

  buildPayload() {
    return {
      schema: "iglu:com.software/plugin/jsonschema/1-0-1",
      data: {
        plugin_id: this.plugin_id,
        plugin_version: this.plugin_version,
        plugin_name: this.plugin_name
      }
    }
  }
}