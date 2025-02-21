// Contains constants for HTTP status codes.
// Used throughout the application to ensure consistency in status code usage.

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
} as const;
