import {hashAndEncryptValues} from '../utils/hash';

// The repo entity
export interface RepoInterface {
  repo_identifier: string;
  repo_name: string;
  owner_id: string;
  git_branch: string;
  git_tag: string;
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

  async buildPayload(jwt: string) {
    const hashedValues = await hashAndEncryptValues(
      [
        {value: this.repo_name, dataType: 'repo_name'},
        {value: this.repo_identifier, dataType: 'repo_identifier'},
        {value: this.owner_id, dataType: 'owner_id'},
        {value: this.git_branch, dataType: 'git_branch'},
        {value: this.git_tag, dataType: 'git_tag'},
      ],
      jwt
    );

    return {
      schema: 'iglu:com.software/repo/jsonschema/1-0-0',
      data: {
        repo_identifier: hashedValues.repo_identifer,
        repo_name: hashedValues.repo_name,
        owner_id: hashedValues.owner_id,
        git_branch: hashedValues.git_branch,
        git_tag: hashedValues.git_tag,
      },
    };
  }
}
