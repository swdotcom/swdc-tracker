import { RepoInterface } from "../entities/repo";
import { ProjectInterface } from "../entities/project";
import { FileInterface } from "../entities/file";
import { PluginInterface } from "../entities/plugin";
import { AuthInterface } from "../entities/auth";

// The CodeTime event
export interface CodeTimeInterface {
  keystrokes: number,
  lines_added: number,
  lines_removed: number,
  characters_added: number,
  characters_removed: number,
  single_deletes: number,
  multi_deletes: number,
  single_adds: number,
  multi_adds: number,
  auto_indents: number,
  replacements: number,
  start_time: number,
  end_time: number
}

export class CodeTime implements CodeTimeInterface {
  public keystrokes: number;
  public lines_added: number;
  public lines_removed: number;
  public characters_added: number;
  public characters_removed: number;
  public single_deletes: number;
  public multi_deletes: number;
  public single_adds: number;
  public multi_adds: number;
  public auto_indents: number;
  public replacements: number;
  public start_time: number;
  public end_time: number;

  constructor(data: CodeTimeInterface) {
    this.keystrokes = data.keystrokes;
    this.lines_added = data.lines_added;
    this.lines_removed = data.lines_removed;
    this.characters_added = data.characters_added;
    this.characters_removed = data.characters_removed;
    this.single_deletes = data.single_deletes;
    this.multi_deletes = data.multi_deletes;
    this.single_adds = data.single_adds;
    this.multi_adds = data.multi_adds;
    this.auto_indents = data.auto_indents;
    this.replacements = data.replacements;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
  }

  static hasData(data: CodeTimeInterface) {
    return data.start_time && data.start_time;
  }

  buildPayload() {

    return {
      schema: "iglu:com.software/codetime/jsonschema/1-0-2",
      data: {
        keystrokes: this.keystrokes,
        lines_added: this.lines_added,
        lines_removed: this.lines_removed,
        characters_added: this.characters_added,
        characters_removed: this.characters_removed,
        single_deletes: this.single_deletes,
        multi_deletes: this.multi_deletes,
        single_adds: this.single_adds,
        multi_adds: this.multi_adds,
        auto_indents: this.auto_indents,
        replacements: this.replacements,
        start_time: this.start_time,
        end_time: this.end_time
      }
    }
  }
}

export interface CodeTimeParams extends
  AuthInterface, PluginInterface, RepoInterface, ProjectInterface, FileInterface, CodeTimeInterface { }
