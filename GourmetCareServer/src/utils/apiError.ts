export class ApiError extends Error {
  constructor(public statusCode: number, public message: string, public success?: boolean, public errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}
