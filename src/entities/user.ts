// The user entity
export interface User {
  id: number
}

export class UserImpl implements User {
  public id: number;

  constructor(params: User) {
    this.id = params.id;
  }
}

export async function buildUserPayload(user: User) {

  return {
    schema: "iglu:com.software/user/jsonschema/1-0-0",
    data: {
      ...user
    }
  }
}