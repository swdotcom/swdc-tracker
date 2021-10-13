// The auth entity
export interface AuthInterface {
  jwt: string;
}

export class Auth implements AuthInterface {
  public jwt: string;

  constructor(data: AuthInterface) {
    this.jwt = data.jwt;
  }

  buildPayload() {
    return {
      schema: 'iglu:com.software/auth/jsonschema/1-0-0',
      data: {
        jwt: this.jwt,
      },
    };
  }
}
