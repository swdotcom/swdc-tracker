// The auth entity
export interface Auth {
  jwt: string
}

export function buildAuthPayload(jwt: string) {
  return {
    schema: "iglu:com.software/auth/jsonschema/1-0-0",
    data: {
      jwt
    }
  }
}