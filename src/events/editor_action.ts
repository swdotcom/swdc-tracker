import { Plugin } from "../entities/plugin";
import { File } from "../entities/file";
import { Project } from "../entities/project";

// The EditorAction event
export interface EditorAction {
  entity: string,
  type: string,
  tz_offset_minutes: number
}

export class EditorActionImpl implements EditorAction {
  public entity: string;
  public type: string;
  public tz_offset_minutes: number;

  constructor(params: EditorAction) {
    this.entity = params.entity;
    this.type = params.type;
    this.tz_offset_minutes = params.tz_offset_minutes;
  }
}

export interface EditorActionParams extends Plugin, File, Project, EditorAction {
  jwt: string
}

export async function buildEditorActionPayload(params: EditorAction) {
  return {
    schema: "iglu:com.software/editor_action/jsonschema/1-0-0",
    data: {
      ...params
    }
  }
}