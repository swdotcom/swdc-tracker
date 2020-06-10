export function filePayload(
  name: string, 
  path: string, 
  syntax: string,
  line_count: number,
  character_count: number
) {
  return {
    schema: "iglu:com.software/file/jsonschema/1-0-0",
    data: {
      name: name,
      path: path,
      syntax: syntax,
      line_count: line_count,
      character_count: character_count
    }
  }
}

export function projectPayload(
  name: string,
  directory: string
) {
  return {
    schema: "iglu:com.software/project/jsonschema/1-0-0",
    data: {
      name: name,
      directory: directory
    }
  }
}

export function pluginPayload(id?: number, version?: string) {
  return {
    schema: "iglu:com.software/plugin/jsonschema/1-0-0",
    data: {
      id: id,
      version: version
    }
  }
}

export function repoPayload(
  identifier: string,
  name: string,
  owner_id: string,
  git_branch: string,
  git_tag: string,
) {
  return {
    schema: "iglu:com.software/repo/jsonschema/1-0-0",
    data: {
      identifier: identifier,
      name: name,
      owner_id: owner_id,
      git_branch: git_branch,
      git_tag: git_tag
    }
  }
}

export function authPayload(jwt: string) {
  return {
    schema: "iglu:com.software/auth/jsonschema/1-0-0",
    data:  {
      jwt: jwt
    }
  }
}