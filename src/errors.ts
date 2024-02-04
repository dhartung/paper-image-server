export abstract class HttpError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
      super(message);
    }
  }

export class Unauthorized extends HttpError {
    statusCode: number = 401;

    constructor(message: string) {
      super(message);
    }
  }