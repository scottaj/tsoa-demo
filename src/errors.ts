export class WebServerError extends Error {
  constructor(msg: string, public httpCode: number) {
    super(msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, WebServerError.prototype)
  }
}

export class NotFoundError extends WebServerError {
  constructor(msg: string) {
    super(msg, 404)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, WebServerError.prototype)
  }
}

export class UnauthorizedError extends WebServerError {
  constructor(msg: string) {
    super(msg, 401)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, WebServerError.prototype)
  }
}