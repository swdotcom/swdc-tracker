export function filePayload(
  name?: string, 
  path?: string, 
  syntax?: string,
  line_count?: number,
  character_count?: number
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
  name?: string,
  directory?: string
) {
  return {
    schema: "iglu:com.software/project/jsonschema/1-0-0",
    data: {
      name: name,
      directory: directory
    }
  }
}

export function userPayload(id: number) {
  return {
    schema: "iglu:com.software/user/jsonschema/1-0-2",
    data: {
      id: id
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