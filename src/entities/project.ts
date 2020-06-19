import { hashValue } from "../utils/hash";

// The project entity
export interface Project {
  project_name: string,
  project_directory: string
}

export class ProjectImpl implements Project {
  public project_name: string;
  public project_directory: string;

  constructor(params: Project) {
    this.project_name = params.project_name;
    this.project_directory = params.project_directory;
  }
}

export async function buildProjectPayload(project: Project) {

  const hashedName = await hashValue(project.project_name);
  const hashedDirectory = await hashValue(project.project_directory);

  return {
    schema: "iglu:com.software/project/jsonschema/1-0-0",
    data: {
      project_name: hashedName,
      project_directory: hashedDirectory
    }
  }
}