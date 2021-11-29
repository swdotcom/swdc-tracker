import {PluginInterface} from '../entities/plugin';
import {FileInterface} from '../entities/file';
import {ProjectInterface} from '../entities/project';
import {AuthInterface} from '../entities/auth';
import {RepoInterface} from '../entities/repo';

// The EditorAction event
export const editor_action_schema: string = 'iglu:com.software/editor_action/jsonschema/1-0-2';

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
      schema: editor_action_schema,
      data: {
        entity: this.entity,
        type: this.type,
      },
    };
  }
}

export interface EditorActionParams
  extends AuthInterface,
    RepoInterface,
    PluginInterface,
    FileInterface,
    ProjectInterface,
    EditorActionInterface {}
