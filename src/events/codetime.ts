import { Repo } from "../entities/repo";
import { Project } from "../entities/project";
import { File } from "../entities/file";
import { Plugin } from "../entities/plugin";

// The CodeTime event
export interface CodeTime {
  keystrokes: number,
  chars_added: number,
  chars_deleted: number,
  chars_pasted: number,
  pastes: number,
  lines_added: number,
  lines_deleted: number,
  start_time: number,
  end_time: number,
  tz_offset_minutes: number
}

export class CodeTimeImpl implements CodeTime {
  public keystrokes: number;
  public chars_added: number;
  public chars_deleted: number;
  public chars_pasted: number;
  public pastes: number;
  public lines_added: number;
  public lines_deleted: number;
  public start_time: number;
  public end_time: number;
  public tz_offset_minutes: number;

  constructor(params: CodeTime) {
    this.keystrokes = params.keystrokes;
    this.chars_added = params.chars_added;
    this.chars_deleted = params.chars_deleted;
    this.chars_pasted = params.chars_pasted;
    this.pastes = params.pastes;
    this.lines_added = params.lines_added;
    this.lines_deleted = params.lines_deleted;
    this.start_time = params.start_time;
    this.end_time = params.end_time;
    this.tz_offset_minutes = params.tz_offset_minutes;
  }
}

export interface CodeTimeParams extends Plugin, Repo, Project, File, CodeTime {
  jwt: string
}

export async function buildCodeTimePayload(params: CodeTime) {

  return {
    schema: "iglu:com.software/codetime/jsonschema/1-0-0",
    data: {
      ...params
    }
  }
}
