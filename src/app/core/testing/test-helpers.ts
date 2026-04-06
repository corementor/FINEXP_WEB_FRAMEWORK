import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Employee,
  Principal,
  AuthToken,
  AuditEvent,
  UserRole,
  Permission,
  ESecurityLabel,
  ELifeCycle,
} from '@app/core/models/domain.models';
import { ApiResponse } from '@app/core/models';
import { AuthService } from '@app/core/services/auth.service';
import { MockApiService } from './mock-api.service';

/**
 * Factory: Create mock employee object
 */
export function createMockEmployee(overrides?: Partial<Employee>): Employee {
  return {
    id: '1',
    name: 'John Doe',
    employeeNumber: 'EMP-001',
    nationalId: '123456789',
    emailAddress: 'john.doe@finxp.com',
    phoneNumber: '+234-000-0000',
    department: 'Finance',
    position: 'Senior Manager',
    salary: 150000,
    securityLabel: ESecurityLabel.INTERNAL,
    state: ELifeCycle.ACTIVE,
    version: 1,
    hireDate: '2020-01-15',
    ...overrides,
  };
}

/**
 * Factory: Create mock authenticated user state
 */
export function createMockAuthState(user?: Partial<Principal>): Principal {
  return {
    id: 'user-001',
    username: 'johndoe',
    email: 'john.doe@finxp.com',
    roles: [UserRole.ADMIN],
    permissions: Object.values(Permission),
    department: 'Management',
    lastLogin: new Date().toISOString(),
    ...user,
  };
}

/**
 * Factory: Create mock auth token
 */
export function createMockAuthToken(overrides?: Partial<AuthToken>): AuthToken {
  return {
    accessToken: 'mock_token_' + Date.now(),
    refreshToken: 'mock_refresh_' + Date.now(),
    expiresIn: 3600,
    tokenType: 'Bearer',
    ...overrides,
  };
}

/**
 * Factory: Create mock API response
 */
export function createMockApiResponse<T>(data: T): ApiResponse<T> {
  return {
    result: data,
    messages: [],
    messageCodes: [],
    simpleMessage: 'Success',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Factory: Create mock audit event
 */
export function createMockAuditEvent(overrides?: Partial<AuditEvent>): AuditEvent {
  return {
    id: 'audit-001',
    version: 1,
    securityLabel: ESecurityLabel.INTERNAL,
    actionDate: new Date().toISOString(),
    userId: 'user-001',
    operation: 'CREATE',
    serviceClass: 'EmployeeService',
    serviceMethod: 'create',
    clientIP: '127.0.0.1',
    ...overrides,
  };
}

/**
 * Test setup: Create a pre-configured TestBed with auth and HTTP mocking
 */
export function setupAuthTestBed(): void {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [AuthService, MockApiService],
  });
}

/**
 * Mock Authentication Service for testing
 * Use this in tests that need auth without real login
 */
export class MockAuthService {
  isAuthenticated$ = signal(false);
  currentUser$ = signal<Principal | null>(null);
  authToken$ = signal<AuthToken | null>(null);

  constructor() {}

  login(email: string, password: string): Observable<AuthToken> {
    const token = createMockAuthToken();
    const user = createMockAuthState({ email });

    this.authToken$.set(token);
    this.currentUser$.set(user);
    this.isAuthenticated$.set(true);

    return of(token);
  }

  logout(): void {
    this.authToken$.set(null);
    this.currentUser$.set(null);
    this.isAuthenticated$.set(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticated$();
  }

  getCurrentUser(): Principal | null {
    return this.currentUser$();
  }

  getToken(): string | null {
    return this.authToken$()?.accessToken || null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser$()?.roles?.includes(role) || false;
  }

  hasPermission(permission: Permission): boolean {
    return this.currentUser$()?.permissions?.includes(permission) || false;
  }
}

/**
 * Fixture: Mock employees for testing
 */
export const MOCK_EMPLOYEES: Employee[] = [
  createMockEmployee({ id: '1', employeeNumber: 'EMP-001', name: 'John Doe' }),
  createMockEmployee({ id: '2', employeeNumber: 'EMP-002', name: 'Jane Smith' }),
  createMockEmployee({ id: '3', employeeNumber: 'EMP-003', name: 'Bob Johnson' }),
];

/**
 * Fixture: Mock audit events for testing
 */
export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  createMockAuditEvent({ id: 'audit-001', operation: 'CREATE' }),
  createMockAuditEvent({ id: 'audit-002', operation: 'UPDATE' }),
  createMockAuditEvent({ id: 'audit-003', operation: 'DELETE' }),
];

/**
 * Fixture: Mock workflow states for testing
 */
export const MOCK_WORKFLOW_DATA = {
  pending: ['Pending Review', 'Manager Approval', 'Finance Approval'],
  approved: ['Approved', 'Completed'],
  rejected: ['Rejected', 'Archived'],
};

/**
 * Error Test Data
 * Common error scenarios for testing error handling
 */
export const ERROR_TEST_DATA = {
  ValidationError: {
    status: 400,
    message: 'Validation failed',
    details: ['Field is required'],
  },
  NotFoundError: {
    status: 404,
    message: 'Resource not found',
  },
  UnauthorizedError: {
    status: 401,
    message: 'Unauthorized',
  },
  ServerError: {
    status: 500,
    message: 'Internal server error',
  },
  NetworkError: {
    status: 0,
    message: 'Network error',
  },
};
