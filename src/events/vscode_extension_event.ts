import { PluginInterface } from '../entities/plugin';
import { AuthInterface } from '../entities/auth';
import { VSCodeExtension } from '../entities/vscode_extension';

// The UI Interaction event
export const vscode_extension_schema = 'iglu:com.software/vscode_extension_event/jsonschema/1-0-0';

export interface VSCodeExtensionEventInterface {
  action: string; // installed | uninstalled | enabled | disabled
  event_at: string; // ISO 8601 format
  os: string // max len of 255
}

export class VSCodeExtensionEvent implements VSCodeExtensionEventInterface {
  public action: string;
  public event_at: string;
  public os: string

  constructor(data: VSCodeExtensionEventInterface) {
    this.action = data.action;
    this.event_at = data.event_at;
    this.os = data.os;
  }

  // required: [action, event_at]
  static hasData(data: VSCodeExtensionEventInterface) {
    return data.action && data.event_at;
  }

  buildPayload() {
    return {
      schema: vscode_extension_schema,
      data: {
        action: this.action,
        event_at: this.event_at,
        os: this.os
      },
    };
  }
}

export interface VSCodeExtensionEventParams
  extends AuthInterface,
    VSCodeExtension,
    PluginInterface,
    VSCodeExtensionEventInterface {}
