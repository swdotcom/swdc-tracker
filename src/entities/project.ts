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

  static hasData(data: ProjectInterface) {
    return data.project_name && data.project_directory;
  }

  async buildPayload(jwt: string) {

    const hashedName = await hashValue(this.project_name, "project_name", jwt);
    const hashedDirectory = await hashValue(this.project_directory, "project_directory", jwt);

    return {
      schema: "iglu:com.software/project/jsonschema/1-0-0",
      data: {
        project_name: hashedName,
        project_directory: hashedDirectory
      }
    }
  }
}
