import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { ApiResponse } from '@app/core/models';
import { Employee, AuditEvent, ESecurityLabel, ELifeCycle } from '@app/core/models/domain.models';

/**
 * Mock API Service
 * In-memory API for testing without backend dependency
 * Replaces real HTTP calls in test environment
 */
@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  // Mock data storage
  private mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      employeeNumber: 'EMP-001',
      nationalId: '123-456-789',
      emailAddress: 'john.doe@finxp.com',
      securityLabel: ESecurityLabel.INTERNAL,
      state: ELifeCycle.ACTIVE,
      version: 1,
      comments: 'Senior Manager',
    },
    {
      id: '2',
      name: 'Jane Smith',
      employeeNumber: 'EMP-002',
      nationalId: '987-654-321',
      emailAddress: 'jane.smith@finxp.com',
      securityLabel: ESecurityLabel.RESTRICTED,
      state: ELifeCycle.CREATED,
      version: 1,
      comments: 'Pending approval',
    },
  ];

  private mockAuditLogs: AuditEvent[] = [
    {
      id: '1',
      version: 1,
      securityLabel: ESecurityLabel.INTERNAL,
      actionDate: new Date().toISOString(),
      userId: 'admin-001',
      operation: 'CREATE',
      serviceClass: 'EmployeeService',
      serviceMethod: 'create',
      clientIP: '127.0.0.1',
    },
  ];

  private failNextRequest = false;

  /**
   * Simulates GET /employees
   */
  getEmployees(skip = 0, take = 10, search?: string): Observable<ApiResponse<Employee[]>> {
    if (this.failNextRequest) {
      this.failNextRequest = false;
      return throwError(() => ({ status: 500, message: 'Server error' }));
    }

    let filtered = [...this.mockEmployees];

    if (search) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.employeeNumber.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const result = filtered.slice(skip, skip + take);

    return of({
      result,
      messages: [],
      messageCodes: [],
      simpleMessage: 'Success',
      timestamp: new Date().toISOString(),
    }).pipe(delay(200)); // Simulate network latency
  }

  /**
   * Simulates GET /employees/{id}
   */
  getEmployeeById(id: string): Observable<ApiResponse<Employee>> {
    const employee = this.mockEmployees.find((e) => e.id === id);

    if (!employee) {
      return throwError(() => ({ status: 404, message: 'Employee not found' }));
    }

    return of({
      result: employee,
      messages: [],
      messageCodes: [],
      timestamp: new Date().toISOString(),
    }).pipe(delay(100));
  }

  /**
   * Simulates POST /employees
   */
  createEmployee(data: Partial<Employee>): Observable<ApiResponse<Employee>> {
    const newEmployee: Employee = {
      id: Math.random().toString(),
      name: data.name || '',
      employeeNumber: data.employeeNumber || '',
      nationalId: data.nationalId || '',
      emailAddress: data.emailAddress || '',
      securityLabel: data.securityLabel || ESecurityLabel.INTERNAL,
      state: ELifeCycle.CREATED,
      version: 1,
      comments: data.comments || '',
    };

    this.mockEmployees.push(newEmployee);

    return of({
      result: newEmployee,
      messages: ['Employee created successfully'],
      messageCodes: [201],
      timestamp: new Date().toISOString(),
    }).pipe(delay(300));
  }

  /**
   * Simulates PUT /employees/{id}
   */
  updateEmployee(id: string, data: Partial<Employee>): Observable<ApiResponse<Employee>> {
    const index = this.mockEmployees.findIndex((e) => e.id === id);

    if (index === -1) {
      return throwError(() => ({ status: 404, message: 'Employee not found' }));
    }

    const updated: Employee = {
      ...this.mockEmployees[index],
      ...data,
      id, // Preserve ID
      version: this.mockEmployees[index].version + 1,
    };

    this.mockEmployees[index] = updated;

    return of({
      result: updated,
      messages: ['Employee updated successfully'],
      messageCodes: [200],
      timestamp: new Date().toISOString(),
    }).pipe(delay(250));
  }

  /**
   * Simulates DELETE /employees/{id}
   */
  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    const index = this.mockEmployees.findIndex((e) => e.id === id);

    if (index === -1) {
      return throwError(() => ({ status: 404, message: 'Employee not found' }));
    }

    this.mockEmployees.splice(index, 1);

    return of({
      result: undefined as any,
      messages: ['Employee deleted successfully'],
      messageCodes: [200],
      timestamp: new Date().toISOString(),
    }).pipe(delay(200));
  }

  /**
   * Simulates GET /audit-logs
   */
  getAuditLogs(): Observable<ApiResponse<AuditEvent[]>> {
    return of({
      result: this.mockAuditLogs,
      messages: [],
      messageCodes: [],
      timestamp: new Date().toISOString(),
    }).pipe(delay(150));
  }

  /**
   * Test helper: Make next request fail
   */
  setNextRequestToFail(): void {
    this.failNextRequest = true;
  }

  /**
   * Test helper: Reset mock data
   */
  reset(): void {
    this.mockEmployees = [
      {
        id: '1',
        name: 'John Doe',
        employeeNumber: 'EMP-001',
        nationalId: '123-456-789',
        emailAddress: 'john.doe@finxp.com',
        securityLabel: ESecurityLabel.INTERNAL,
        state: ELifeCycle.ACTIVE,
        version: 1,
        comments: 'Senior Manager',
      },
      {
        id: '2',
        name: 'Jane Smith',
        employeeNumber: 'EMP-002',
        nationalId: '987-654-321',
        emailAddress: 'jane.smith@finxp.com',
        securityLabel: ESecurityLabel.RESTRICTED,
        state: ELifeCycle.CREATED,
        version: 1,
        comments: 'Pending approval',
      },
    ];
    this.failNextRequest = false;
  }

  /**
   * Test helper: Add mock employee
   */
  addMockEmployee(employee: Employee): void {
    this.mockEmployees.push(employee);
  }

  /**
   * Test helper: Get all mock employees
   */
  getAllMockEmployees(): Employee[] {
    return [...this.mockEmployees];
  }
}
