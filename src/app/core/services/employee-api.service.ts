import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, AuditEvent } from '../models/domain.models';
import { ApiResponse } from '../models/api-response.model';
import { ApiConfigService } from './api-config.service';
import { LoggerService } from './logger.service';

/**
 * Employee API Service - Communication layer with backend
 * Handles all HTTP calls for employee CRUD operations
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);
  private readonly logger = inject(LoggerService);

  /**
   * Get all employees with optional filtering and pagination
   */
  getEmployees(skip?: number, take?: number, search?: string): Observable<ApiResponse<Employee[]>> {
    this.logger.debug('Fetching employees', { skip, take, search });

    let params = new HttpParams();
    if (skip !== undefined) params = params.set('skip', skip.toString());
    if (take !== undefined) params = params.set('take', take.toString());
    if (search) params = params.set('search', search);

    return this.http.get<ApiResponse<Employee[]>>(this.config.employeeEndpoint, { params });
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id: string): Observable<ApiResponse<Employee>> {
    this.logger.debug('Fetching employee', { id });
    return this.http.get<ApiResponse<Employee>>(`${this.config.employeeEndpoint}/${id}`);
  }

  /**
   * Create new employee
   */
  createEmployee(
    employee: Omit<Employee, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ): Observable<ApiResponse<Employee>> {
    this.logger.debug('Creating employee', { name: employee.name });
    return this.http.post<ApiResponse<Employee>>(this.config.employeeEndpoint, employee);
  }

  /**
   * Update employee
   */
  updateEmployee(id: string, employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    this.logger.debug('Updating employee', { id });
    return this.http.put<ApiResponse<Employee>>(`${this.config.employeeEndpoint}/${id}`, employee);
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: string): Observable<ApiResponse<null>> {
    this.logger.debug('Deleting employee', { id });
    return this.http.delete<ApiResponse<null>>(`${this.config.employeeEndpoint}/${id}`);
  }

  /**
   * Bulk delete employees
   */
  deleteEmployees(ids: string[]): Observable<ApiResponse<null>> {
    this.logger.debug('Deleting multiple employees', { count: ids.length });
    return this.http.post<ApiResponse<null>>(`${this.config.employeeEndpoint}/bulk/delete`, {
      ids,
    });
  }

  /**
   * Search employees
   */
  searchEmployees(query: string): Observable<ApiResponse<Employee[]>> {
    this.logger.debug('Searching employees', { query });
    return this.http.get<ApiResponse<Employee[]>>(`${this.config.employeeEndpoint}/search`, {
      params: new HttpParams().set('q', query),
    });
  }

  /**
   * Export employees to CSV/Excel
   */
  exportEmployees(): Observable<Blob> {
    this.logger.debug('Exporting employees');
    return this.http.get(`${this.config.employeeEndpoint}/export`, { responseType: 'blob' });
  }

  /**
   * Activate employee
   */
  activateEmployee(id: string): Observable<ApiResponse<Employee>> {
    this.logger.debug('Activating employee', { id });
    return this.http.post<ApiResponse<Employee>>(`${this.config.employeeEndpoint}/${id}/activate`, {});
  }

  /**
   * Deactivate employee
   */
  deactivateEmployee(id: string, comments?: string): Observable<ApiResponse<Employee>> {
    this.logger.debug('Deactivating employee', { id });
    const body = comments ? { comments } : {};
    return this.http.post<ApiResponse<Employee>>(
      `${this.config.employeeEndpoint}/${id}/deactivate`,
      body,
    );
  }
}
