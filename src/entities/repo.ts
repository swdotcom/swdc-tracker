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

  async buildPayload() {

    const hashedName = await hashValue(this.repo_name);
    const hashedIdentifier = await hashValue(this.repo_identifier);
    const hashedOwnerId = await hashValue(this.owner_id);
    const hashedGitBranch = await hashValue(this.git_branch);
    const hashedGitTag = await hashValue(this.git_tag);

    return {
      schema: "iglu:com.software/repo/jsonschema/1-0-0",
      data: {
        repo_identifier: hashedIdentifier,
        reop_name: hashedName,
        owner_id: hashedOwnerId,
        git_branch: hashedGitBranch,
        git_tag: hashedGitTag
      }
    }
  }
}