import { PluginInterface } from "../entities/plugin";
import { ProjectInterface } from "../entities/project";
import { AuthInterface } from "../entities/auth";
import { RepoInterface } from "../entities/repo";
import { UncommittedChangeInterface } from "../entities/uncommitted_change";


// The EditorAction event
export interface GitEventInterface {
  git_event: string;
}

export class GitEvent implements GitEventInterface {
  public git_event: string;

  constructor(data: GitEventInterface) {
    this.git_event = data.git_event;
  }

  static hasData(data: GitEventInterface) {
    return data.git_event;
  }

  buildPayload() {
    return {
      schema: "iglu:com.software/git_event/jsonschema/1-0-0",
      data: {
        git_event: this.git_event
      },
    };
  }
}

export interface GitEventParams
  extends AuthInterface,
  RepoInterface,
  PluginInterface,
  ProjectInterface,
  UncommittedChangeInterface,
  GitEventInterface { }
