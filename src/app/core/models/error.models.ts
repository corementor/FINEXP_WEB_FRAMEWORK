/**
 * Application-level error
 */
export class AppError extends Error {
  constructor(
    override message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static isAppError(error: any): error is AppError {
    return error instanceof AppError;
  }
}

/**
 * Validation error with field-level information
 */
export class ValidationError extends AppError {
  constructor(
    public fieldErrors: Record<string, string[]>,
    override message: string = 'Validation failed',
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  getFieldError(field: string): string[] {
    return this.fieldErrors[field] || [];
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHZ_ERROR', 403);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(
    override message: string = 'Network error',
    override originalError?: any,
  ) {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends AppError {
  constructor(
    override message: string = 'Request timeout',
    public timeout?: number,
  ) {
    super(message, 'TIMEOUT_ERROR', 0);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Server error
 */
export class ServerError extends AppError {
  constructor(message: string = 'Server error occurred') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
