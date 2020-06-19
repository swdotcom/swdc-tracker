import { hashValue } from "../utils/hash";

// The repo entity
export interface Repo {
  repo_identifier: string,
  repo_name: string,
  owner_id: string,
  git_branch: string,
  git_tag: string
}

export class RepoImpl implements Repo {
  public repo_identifier: string;
  public repo_name: string;
  public owner_id: string;
  public git_branch: string;
  public git_tag: string;

  constructor(params: Repo) {
    this.repo_identifier = params.repo_identifier;
    this.repo_name = params.repo_name;
    this.owner_id = params.owner_id;
    this.git_branch = params.git_branch;
    this.git_tag = params.git_tag;
  }
}

export async function buildRepoPayload(repo: Repo) {

  const hashedName = await hashValue(repo.repo_name);
  const hashedIdentifier = await hashValue(repo.repo_identifier);
  const hashedOwnerId = await hashValue(repo.owner_id);
  const hashedGitBranch = await hashValue(repo.git_branch);
  const hashedGitTag = await hashValue(repo.git_tag);

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