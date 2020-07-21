import { hashValue } from "../utils/hash";

// The repo entity
export interface RepoInterface {
  repo_identifier: string,
  repo_name: string,
  owner_id: string,
  git_branch: string,
  git_tag: string
}

export class Repo implements RepoInterface {
  public repo_identifier: string;
  public repo_name: string;
  public owner_id: string;
  public git_branch: string;
  public git_tag: string;

  constructor(data: RepoInterface) {
    this.repo_identifier = data.repo_identifier;
    this.repo_name = data.repo_name;
    this.owner_id = data.owner_id;
    this.git_branch = data.git_branch;
    this.git_tag = data.git_tag;
  }

  static hasData(data: RepoInterface) {
    return data.repo_identifier;
  }

  async buildPayload(jwt?: string) {

    const hashedName = await hashValue(this.repo_name, "repo_name", jwt);
    const hashedIdentifier = await hashValue(this.repo_identifier, "repo_identifier", jwt);
    const hashedOwnerId = await hashValue(this.owner_id, "owner_id", jwt);
    const hashedGitBranch = await hashValue(this.git_branch, "git_branch", jwt);
    const hashedGitTag = await hashValue(this.git_tag, "git_tag", jwt);

    return {
      schema: "iglu:com.software/repo/jsonschema/1-0-0",
      data: {
        repo_identifier: hashedIdentifier,
        repo_name: hashedName,
        owner_id: hashedOwnerId,
        git_branch: hashedGitBranch,
        git_tag: hashedGitTag
      }
    }
  }
}
