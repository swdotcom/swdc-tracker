import { hashValue } from "../utils/hash";

// The file entity
export interface File {
  file_name: string,
  file_path: string,
  syntax: string,
  line_count: number,
  character_count: number
}

export class FileImpl implements File {
  public file_name: string;
  public file_path: string;
  public syntax: string;
  public line_count: number;
  public character_count: number;

  constructor(params: File) {
    this.file_name = params.file_name;
    this.file_path = params.file_path;
    this.syntax = params.syntax;
    this.line_count = params.line_count;
    this.character_count = params.character_count;
  }
}

export async function buildFilePayload(file: File) {

  const hashedName = await hashValue(file.file_name);
  const hashedPath = await hashValue(file.file_path);

  return {
    schema: "iglu:com.software/file/jsonschema/1-0-0",
    data: {
      file_name: hashedName,
      file_path: hashedPath,
      syntax: file.syntax,
      line_count: file.line_count,
      character_count: file.character_count
    }
  }
}