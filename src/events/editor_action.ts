import { PluginInterface } from "../entities/plugin";
import { FileInterface } from "../entities/file";
import { ProjectInterface } from "../entities/project";

// The EditorAction event
export interface EditorActionInterface {
  entity: string,
  type: string,
  tz_offset_minutes: number
}

export class EditorAction implements EditorActionInterface {
  public entity: string;
  public type: string;
  public tz_offset_minutes: number;

  constructor(data: EditorActionInterface) {
    this.entity = data.entity;
    this.type = data.type;
    this.tz_offset_minutes = data.tz_offset_minutes;
  }

  hasData() {
    return this.entity ? true : false;
  }

  buildPayload() {
    return {
      schema: "iglu:com.software/editor_action/jsonschema/1-0-0",
      data: {
        entity: this.entity,
        type: this.type,
        tz_offset_minutes: this.tz_offset_minutes
      }
    }
  }
}

export interface EditorActionParams extends PluginInterface, FileInterface, ProjectInterface, EditorActionInterface {
  jwt: string
}