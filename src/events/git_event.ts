import { PluginInterface } from "../entities/plugin";
import { ProjectInterface } from "../entities/project";
import { AuthInterface } from "../entities/auth";
import { RepoInterface } from "../entities/repo";
import { FileChangeInterface } from "../entities/file_change";


// The EditorAction event
export interface GitEventInterface {
  git_event_type: string;
  git_event_timestamp: string;
  commit_id: string;
}

export class GitEvent implements GitEventInterface {
  public git_event_type: string;
  public git_event_timestamp: string;
  public commit_id: string;

  constructor(data: GitEventInterface) {
    this.git_event_type = data.git_event_type;
    this.git_event_timestamp = data.git_event_timestamp;
    this.commit_id = data.commit_id;
  }

  static hasData(data: GitEventInterface) {
    return data.git_event_type;
  }

  buildPayload() {
    return {
      schema: "iglu:com.software/git_event/jsonschema/1-0-0",
      data: {
        git_event_type: this.git_event_type,
        git_event_timestamp: this.git_event_timestamp,
        commit_id: this.commit_id
      },
    };
  }
}

export interface GitEventParams
  extends AuthInterface,
  RepoInterface,
  PluginInterface,
  ProjectInterface,
  FileChangeInterface,
  GitEventInterface { }
