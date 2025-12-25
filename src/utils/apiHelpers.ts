export class ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;

  constructor(success: boolean, message: string, data?: any, errors?: any) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
    if (errors) this.errors = errors;
  }
}

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
