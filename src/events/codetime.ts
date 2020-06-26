import { RepoInterface } from "../entities/repo";
import { ProjectInterface } from "../entities/project";
import { FileInterface } from "../entities/file";
import { PluginInterface } from "../entities/plugin";
import { AuthInterface } from "../entities/auth";

// The CodeTime event
export interface CodeTimeInterface {
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

export class CodeTime implements CodeTimeInterface {
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

  constructor(data: CodeTimeInterface) {
    this.keystrokes = data.keystrokes;
    this.chars_added = data.chars_added;
    this.chars_deleted = data.chars_deleted;
    this.chars_pasted = data.chars_pasted;
    this.pastes = data.pastes;
    this.lines_added = data.lines_added;
    this.lines_deleted = data.lines_deleted;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.tz_offset_minutes = data.tz_offset_minutes;
  }

  static hasData(data: CodeTimeInterface) {
    return data.start_time && data.start_time;
  }

  buildPayload() {

    return {
      schema: "iglu:com.software/codetime/jsonschema/1-0-1",
      data: {
        keystrokes: this.keystrokes,
        chars_added: this.chars_deleted,
        chars_deleted: this.chars_deleted,
        chars_pasted: this.chars_pasted,
        pastes: this.pastes,
        lines_added: this.lines_added,
        lines_deleted: this.lines_deleted,
        start_time: this.start_time,
        end_time: this.end_time,
        tz_offset_minutes: this.tz_offset_minutes
      }
    }
  }
}

export interface CodeTimeParams extends
  AuthInterface, PluginInterface, RepoInterface, ProjectInterface, FileInterface, CodeTimeInterface { }
