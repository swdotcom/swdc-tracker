import { hashValue } from "../utils/hash";

// The project entity
export interface ProjectInterface {
  project_name: string,
  project_directory: string
}

export class Project implements ProjectInterface {
  public project_name: string;
  public project_directory: string;

  constructor(data: ProjectInterface) {
    this.project_name = data.project_name;
    this.project_directory = data.project_directory;
  }

  hasData() {
    return this.project_name && this.project_directory ? true : false;
  }

  async buildPayload() {

    const hashedName = await hashValue(this.project_name);
    const hashedDirectory = await hashValue(this.project_directory);

    return {
      schema: "iglu:com.software/project/jsonschema/1-0-0",
      data: {
        project_name: hashedName,
        project_directory: hashedDirectory
      }
    }
  }
}