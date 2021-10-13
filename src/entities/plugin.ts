// The plugin entity
export interface PluginInterface {
  plugin_id: number;
  plugin_version: string;
  plugin_name: string;
  editor_name: string;
  editor_version: string;
}

export class Plugin implements PluginInterface {
  public plugin_id: number;
  public plugin_version: string;
  public plugin_name: string;
  public editor_name: string;
  public editor_version: string;

  constructor(data: PluginInterface) {
    this.plugin_id = data.plugin_id;
    this.plugin_version = data.plugin_version;
    this.plugin_name = data.plugin_name;
    this.editor_name = data.editor_name;
    this.editor_version = data.editor_version;
  }

  static hasData(data: PluginInterface) {
    return data.plugin_id && data.plugin_version;
  }

  buildPayload() {
    return {
      schema: 'iglu:com.software/plugin/jsonschema/1-0-2',
      data: {
        plugin_id: this.plugin_id,
        plugin_version: this.plugin_version,
        plugin_name: this.plugin_name,
        editor_name: this.editor_name,
        editor_version: this.editor_version,
      },
    };
  }
}
