import { hashValue } from "../utils/hash";

// The file entity
export interface FileInterface {
  file_name: string,
  file_path: string,
  syntax: string,
  line_count: number,
  character_count: number
}

export class File implements FileInterface {
  public file_name: string;
  public file_path: string;
  public syntax: string;
  public line_count: number;
  public character_count: number;

  constructor(data: FileInterface) {
    this.file_name = data.file_name;
    this.file_path = data.file_path;
    this.syntax = data.syntax;
    this.line_count = data.line_count;
    this.character_count = data.character_count;
  }

  static hasData(data: FileInterface) {
    return data.file_name && data.file_path;
  }

  async buildPayload() {

    const hashedName = await hashValue(this.file_name);
    const hashedPath = await hashValue(this.file_path);

    return {
      schema: "iglu:com.software/file/jsonschema/1-0-1",
      data: {
        file_name: hashedName,
        file_path: hashedPath,
        syntax: this.syntax,
        line_count: this.line_count,
        character_count: this.character_count
      }
    }
  }

}