import {hashValue} from '../utils/hash';

// The Uncommitted Change entity

export interface FileChangeInterface {
  file_name: string;
  insertions: number;
  deletions: number;
}

export class FileChange implements FileChangeInterface {
  public file_name: string;
  public insertions: number;
  public deletions: number;

  constructor(data: FileChangeInterface) {
    this.file_name = data.file_name;
    this.insertions = data.insertions;
    this.deletions = data.deletions;
  }

  static hasData(data: FileChangeInterface) {
    return data.file_name ?? data.insertions ?? data.deletions;
  }

  async buildPayload(jwt: string) {
    return {
      schema: 'iglu:com.software/file_change/jsonschema/1-0-0',
      data: {
        // Only hash the value here. If the user works on this
        // file, it will be tracked as a separate event and
        // encrypted at that point in time.
        file_name: await hashValue(this.file_name),
        insertions: this.insertions,
        deletions: this.deletions,
      },
    };
  }
}
