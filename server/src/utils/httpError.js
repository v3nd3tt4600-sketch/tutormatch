// An Error that also carries an HTTP status code,
// so our errorHandler knows what status to send.
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
