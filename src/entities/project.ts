import {hashAndEncryptValues} from '../utils/hash';

// The project entity
export interface ProjectInterface {
  project_name: string;
  project_directory: string;
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
    const hashedValues = await hashAndEncryptValues(
      [
        {value: this.project_name, dataType: 'project_name'},
        {value: this.project_directory, dataType: 'project_directory'},
      ],
      jwt
    );

    return {
      schema: 'iglu:com.software/project/jsonschema/1-0-0',
      data: {
        project_name: hashedValues.project_name,
        project_directory: hashedValues.project_directory,
      },
    };
  }
}
