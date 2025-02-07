export class ApiResponse extends Error {
  constructor(public statusCode: number, public message: string, public data:object, public success?: boolean, public errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = false;
  }
}