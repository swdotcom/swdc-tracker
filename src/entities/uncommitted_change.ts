import { hashValues } from "../utils/hash";

// The Uncommitted Change entity

export interface UncommittedChangeInterface {
  file_name: string,
  insertions: number,
  deletions: number
}

export class UncommittedChange implements UncommittedChangeInterface {
  public file_name: string;
  public insertions: number;
  public deletions: number;


  constructor(data: UncommittedChangeInterface) {
    this.file_name = data.file_name;
    this.insertions = data.insertions;
    this.deletions = data.deletions;
  }

  static hasData(data: UncommittedChangeInterface) {
    return data.file_name;
  }

  async buildPayload(jwt: string) {
    const hashedValues = await hashValues([
        { value: this.file_name, dataType: "file_name"}
    ], jwt)

    return {
      schema: "iglu:com.software/uncommitted_change/jsonschema/1-0-0",
      data: {
        file_name: hashedValues.file_name,
        insertions: this.insertions,
        deletions: this.deletions
      }
    }
  }
}
