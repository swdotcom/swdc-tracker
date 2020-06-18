import { hashValue } from "./hash"

export async function filePayload(
  name: string,
  path: string,
  syntax: string,
  line_count: number,
  character_count: number
) {

  const hashedName = await hashValue(name);
  const hashedPath = await hashValue(path);

  return {
    schema: "iglu:com.software/file/jsonschema/1-0-0",
    data: {
      name: hashedName,
      path: hashedPath,
      syntax,
      line_count,
      character_count
    }
  }
}

export async function projectPayload(
  name: string,
  directory: string
) {

  const hashedName = await hashValue(name);
  const hashedDirectory = await hashValue(directory);

  return {
    schema: "iglu:com.software/project/jsonschema/1-0-0",
    data: {
      name: hashedName,
      directory: hashedDirectory
    }
  }
}

export function pluginPayload(id: number, version: string) {
  return {
    schema: "iglu:com.software/plugin/jsonschema/1-0-0",
    data: {
      id,
      version
    }
  }
}

export async function repoPayload(
  identifier: string,
  name: string,
  owner_id: string,
  git_branch: string,
  git_tag: string,
) {

  const hashedName = await hashValue(name);
  const hashedIdentifier = await hashValue(identifier);
  const hashedOwnerId = await hashValue(owner_id);
  const hashedGitBranch = await hashValue(git_branch);
  const hashedGitTag = await hashValue(git_tag);

  return {
    schema: "iglu:com.software/repo/jsonschema/1-0-0",
    data: {
      identifier: hashedIdentifier,
      name: hashedName,
      owner_id: hashedOwnerId,
      git_branch: hashedGitBranch,
      git_tag: hashedGitTag
    }
  }
}

export function authPayload(jwt: string) {
  return {
    schema: "iglu:com.software/auth/jsonschema/1-0-0",
    data: {
      jwt
    }
  }
}