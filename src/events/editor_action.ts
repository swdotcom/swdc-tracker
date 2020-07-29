import { PluginInterface } from "../entities/plugin";
import { FileInterface } from "../entities/file";
import { ProjectInterface } from "../entities/project";
import { AuthInterface } from "../entities/auth";

// The EditorAction event
export interface EditorActionInterface {
  entity: string;
  type: string;
}

export class EditorAction implements EditorActionInterface {
  public entity: string;
  public type: string;

  constructor(data: EditorActionInterface) {
    this.entity = data.entity;
    this.type = data.type;
  }

  static hasData(data: EditorActionInterface) {
    return data.entity;
  }

  buildPayload() {
    return {
      schema: "iglu:com.software/editor_action/jsonschema/1-0-1",
      data: {
        entity: this.entity,
        type: this.type
      },
    };
  }
}

export interface EditorActionParams
  extends AuthInterface,
    PluginInterface,
    FileInterface,
    ProjectInterface,
    EditorActionInterface {}
