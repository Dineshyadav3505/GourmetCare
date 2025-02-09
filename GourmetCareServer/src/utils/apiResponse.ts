export class ApiResponse {
    constructor(
      public statusCode: number,
      public message: string,
      public data: object,
      public success: boolean = true
    ) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = success;
    }
  }
  