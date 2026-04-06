# Implementation Guide: Core Models & Types

## 1. API Response Models

```typescript
// core/models/api-response.model.ts

/**
 * Generic API Response wrapper
 * Ensures consistent response structure across all endpoints
 */
export interface ApiResponse<T> {
  result: T;
  messages: string[];
  messageCodes: number[];
  simpleMessage?: string;
  timestamp?: string;
}

/**
 * Envelope for paginated API responses
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Filter criteria for API requests
 */
export interface FilterCriteria {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  [key: string]: any;
}

/**
 * API Error response structure
 */
export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Result wrapper for success/error handling
 */
export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiError };
```

## 2. Domain Models

```typescript
// core/models/domain.models.ts

/**
 * Base entity properties
 */
export interface DomainEntity {
  id: string;
  version: number;
  securityLabel: ESecurityLabel;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Entity with lifecycle state
 */
export interface LifeCycleEntity extends DomainEntity {
  state: ELifeCycle;
  comments?: string;
}

/**
 * Employee domain model
 */
export interface Employee extends LifeCycleEntity {
  employeeNumber: string;
  nationalId: string;
  name: string;
  emailAddress: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  salary?: number;
  nextOfKinId?: string;
  hireDate?: string;
  terminationDate?: string;
}

/**
 * Audit trail event
 */
export interface AuditEvent extends DomainEntity {
  actionDate: string;
  userId: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  serviceClass: string;
  serviceMethod: string;
  clientIP: string;
  userAgent?: string;
  changes?: Record<string, { oldValue: any; newValue: any }>;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalEntities: number;
  activeEntities: number;
  createdEntities: number;
  inactiveEntities: number;
  recentActivity: AuditEvent[];
  systemHealth: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

/**
 * User/Principal information
 */
export interface Principal {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  department?: string;
  lastLogin?: string;
}

/**
 * Authentication token
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * Enumerations
 */
export enum ELifeCycle {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum ESecurityLabel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  READONLY = 'READONLY',
}

export enum Permission {
  // Employee Management
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES',
  CREATE_EMPLOYEE = 'CREATE_EMPLOYEE',
  UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE = 'DELETE_EMPLOYEE',

  // Workflows
  MANAGE_WORKFLOWS = 'MANAGE_WORKFLOWS',
  APPROVE_WORKFLOWS = 'APPROVE_WORKFLOWS',

  // Audit
  VIEW_AUDIT = 'VIEW_AUDIT',
  EXPORT_AUDIT = 'EXPORT_AUDIT',

  // Admin
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
}
```

## 3. DTO Models (Data Transfer Objects)

```typescript
// core/models/dtos.models.ts

/**
 * Create Employee Request DTO
 */
export interface CreateEmployeeDto {
  employeeNumber: string;
  nationalId: string;
  name: string;
  emailAddress: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  salary?: number;
  nextOfKinId?: string;
  hireDate?: string;
  securityLabel: ESecurityLabel;
}

/**
 * Update Employee Request DTO
 */
export interface UpdateEmployeeDto {
  employeeNumber?: string;
  nationalId?: string;
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  salary?: number;
  nextOfKinId?: string;
  securityLabel?: ESecurityLabel;
  comments?: string;
}

/**
 * Deactivate Employee Request DTO
 */
export interface DeactivateEmployeeDto {
  comments: string;
  effectiveDate?: string;
  reason: 'RESIGNATION' | 'TERMINATION' | 'RETIREMENT' | 'OTHER';
}

/**
 * Login Request DTO
 */
export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string; // For two-factor authentication
}

/**
 * Forgot Password Request DTO
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * Reset Password Request DTO
 */
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Audit Trail Filter DTO
 */
export interface AuditFilterDto extends PaginationParams {
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  operation?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  serviceClass?: string;
  ipAddress?: string;
}

/**
 * Employee Search/Filter DTO
 */
export interface EmployeeFilterDto extends PaginationParams {
  search?: string;
  status?: ELifeCycle;
  securityLabel?: ESecurityLabel;
  department?: string;
  position?: string;
}
```

## 4. Form Models

```typescript
// features/employees/models/employee-form.model.ts

/**
 * Form control model with metadata for dynamic forms
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'date';
  placeholder?: string;
  required: boolean;
  disabled?: boolean;
  value?: any;
  validators?: any[];
  errorMessages?: Record<string, string>;
  options?: Array<{ label: string; value: any }>;
  hint?: string;
  className?: string;
}

/**
 * Employee Form State
 */
export interface EmployeeFormState {
  data: Partial<Employee> | null;
  isSubmitting: boolean;
  isLoading: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
  isTouched: Record<string, boolean>;
}

/**
 * Form Metadata
 */
export interface FormMetadata {
  title: string;
  description?: string;
  submitButtonLabel: string;
  cancelButtonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
}
```

## 5. Filter & Pagination Models

```typescript
// core/models/filter.models.ts

/**
 * Advanced filter configuration
 */
export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in' | 'between';
  value: any;
  caseSensitive?: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Query parameters
 */
export interface QueryParams {
  filters?: FilterConfig[];
  sort?: SortConfig[];
  pagination?: PaginationParams;
  search?: string;
}

/**
 * Query builder result
 */
export interface Query {
  params: Record<string, any>;
  url: string;
}
```

## 6. Error Models

```typescript
// core/models/error.models.ts

/**
 * Application-level error
 */
export class AppError extends Error {
  constructor(
    public message: string,
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
    message: string = 'Validation failed',
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
 * Server error
 */
export class ServerError extends AppError {
  constructor(message: string = 'Server error occurred') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
```

## Usage Examples

### Creating an Employee

```typescript
// Usage in component
const createEmployeeDto: CreateEmployeeDto = {
  employeeNumber: 'EMP-001',
  nationalId: '12345678',
  name: 'John Doe',
  emailAddress: 'john@example.com',
  department: 'Engineering',
  position: 'Senior Developer',
  salary: 150000,
  securityLabel: ESecurityLabel.INTERNAL,
  hireDate: new Date().toISOString(),
};

this.employeeService.createEmployee(createEmployeeDto).subscribe(
  (employee: Employee) => {
    console.log('Employee created:', employee);
  },
  (error: AppError) => {
    console.error('Failed to create employee:', error.message);
  },
);
```

### Handling Validation Errors

```typescript
// Usage in component
try {
  const errors = new ValidationError({
    email: ['Invalid email format'],
    name: ['Name is required', 'Name must be at least 3 characters'],
  });

  const emailErrors = errors.getFieldError('email');
  console.log(emailErrors); // ['Invalid email format']
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors specifically
    console.log('Field errors:', error.fieldErrors);
  }
}
```

## Benefits

✅ **Type Safety**: Compile-time type checking  
✅ **Consistency**: Standardized models across the app  
✅ **Documentation**: Self-documenting interfaces  
✅ **Reusability**: Models used across multiple services  
✅ **Maintainability**: Changes in one place propagate correctly  
✅ **Error Handling**: Specific error types for different scenarios
