import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError, mergeMap } from 'rxjs/operators';
import { EmployeeApiService, LoggerService } from '@app/core/services';
import { AppStateStore } from '@app/core/state';
import { Employee, ApiResponse } from '@app/core/models';
import { ValidationService } from '@app/shared/services/validation.service';

/**
 * Employee Facade Service
 * Orchestrates employee CRUD operations and state management
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeFacadeService {
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly logger = inject(LoggerService);
  private readonly store = inject(AppStateStore);
  private readonly validator = inject(ValidationService);

  /**
   * Get all employees with optional filtering
   */
  getEmployees(skip = 0, take = 10, search?: string): Observable<Employee[]> {
    this.logger.debug('Facade: fetching employees', { skip, take, search });

    return this.employeeApi.getEmployees(skip, take, search).pipe(
      tap((response: ApiResponse<Employee[]>) => {
        this.store.setEmployees(response.result || []);
        this.logger.info('Facade: employees fetched', {
          count: response.result?.length || 0,
        });
      }),
      map((response: ApiResponse<Employee[]>) => response.result || []),
      catchError((error) => {
        this.logger.error('Facade: failed to fetch employees', error);
        this.store.setError('Failed to load employees');
        throw error;
      }),
    );
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id: string): Observable<Employee> {
    this.logger.debug('Facade: fetching employee', { id });

    return this.employeeApi.getEmployeeById(id).pipe(
      tap((response: ApiResponse<Employee>) => {
        this.store.selectEmployee(response.result || null);
        this.logger.info('Facade: employee fetched', { id });
      }),
      map((response: ApiResponse<Employee>) => response.result!),
      catchError((error) => {
        this.logger.error('Facade: failed to fetch employee', error);
        this.store.setError('Failed to load employee');
        throw error;
      }),
    );
  }

  /**
   * Create new employee with validation
   */
  createEmployee(
    employee: Omit<Employee, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ): Observable<Employee> {
    this.logger.debug('Facade: creating employee', { name: employee['name'] });

    // Pre-API validation using ValidationService
    return this.validator.validateEmployeeForm(employee).pipe(
      mergeMap((validation) => {
        if (!validation.valid) {
          const errorMessage = validation.errors.join(', ');
          this.logger.warn('Facade: employee validation failed', validation.errors);
          this.store.setError(errorMessage);
          return throwError(() => new Error(errorMessage));
        }

        // Proceed with API call if validation passes
        return this.employeeApi.createEmployee(employee).pipe(
          tap((response: ApiResponse<Employee>) => {
            const newEmployee = response.result!;
            this.store.addEmployee(newEmployee);
            this.logger.info('Facade: employee created', { id: newEmployee.id });
          }),
          map((response: ApiResponse<Employee>) => response.result!),
          catchError((error) => {
            this.logger.error('Facade: failed to create employee', error);
            this.store.setError('Failed to create employee');
            throw error;
          }),
        );
      }),
    );
  }

  /**
   * Update employee with validation
   */
  updateEmployee(id: string, updates: Partial<Employee>): Observable<Employee> {
    this.logger.debug('Facade: updating employee', { id });

    // Pre-API validation using ValidationService
    return this.validator.validateEmployeeForm(updates as any).pipe(
      mergeMap((validation) => {
        if (!validation.valid) {
          const errorMessage = validation.errors.join(', ');
          this.logger.warn('Facade: employee validation failed', validation.errors);
          this.store.setError(errorMessage);
          return throwError(() => new Error(errorMessage));
        }

        // Proceed with API call if validation passes
        return this.employeeApi.updateEmployee(id, updates).pipe(
          tap((response: ApiResponse<Employee>) => {
            const updated = response.result!;
            this.store.updateEmployee(id, updated);
            this.logger.info('Facade: employee updated', { id });
          }),
          map((response: ApiResponse<Employee>) => response.result!),
          catchError((error) => {
            this.logger.error('Facade: failed to update employee', error);
            this.store.setError('Failed to update employee');
            throw error;
          }),
        );
      }),
    );
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: string): Observable<void> {
    this.logger.debug('Facade: deleting employee', { id });

    return this.employeeApi.deleteEmployee(id).pipe(
      tap(() => {
        this.store.removeEmployee(id);
        this.logger.info('Facade: employee deleted', { id });
      }),
      map(() => undefined),
      catchError((error) => {
        this.logger.error('Facade: failed to delete employee', error);
        this.store.setError('Failed to delete employee');
        throw error;
      }),
    );
  }

  /**
   * Delete several employees at once
   */
  deleteEmployees(ids: string[]): Observable<string[]> {
    this.logger.debug('Facade: deleting employees', { count: ids.length });

    return this.employeeApi.deleteEmployees(ids).pipe(
      tap(() => {
        ids.forEach((id) => this.store.removeEmployee(id));
        this.logger.info('Facade: employees deleted', { count: ids.length });
      }),
      map(() => ids),
      catchError((error) => {
        this.logger.error('Facade: failed to delete employees', error);
        this.store.setError('Failed to delete the selected employees');
        throw error;
      }),
    );
  }

  /**
   * Search employees
   */
  searchEmployees(query: string): Observable<Employee[]> {
    this.logger.debug('Facade: searching employees', { query });

    return this.employeeApi.searchEmployees(query).pipe(
      tap((response: ApiResponse<Employee[]>) => {
        this.logger.info('Facade: search completed', {
          count: response.result?.length || 0,
        });
      }),
      map((response: ApiResponse<Employee[]>) => response.result || []),
      catchError((error) => {
        this.logger.error('Facade: search failed', error);
        throw error;
      }),
    );
  }

  /**
   * Export employees to CSV
   */
  exportEmployees(): Observable<Blob> {
    this.logger.debug('Facade: exporting employees');

    return this.employeeApi.exportEmployees().pipe(
      tap(() => {
        this.logger.info('Facade: export completed');
      }),
      catchError((error) => {
        this.logger.error('Facade: export failed', error);
        throw error;
      }),
    );
  }

  /**
   * Activate employee
   */
  activateEmployee(id: string): Observable<Employee> {
    this.logger.debug('Facade: activating employee', { id });

    return this.employeeApi.activateEmployee(id).pipe(
      tap((response: ApiResponse<Employee>) => {
        this.logger.info('Facade: employee activated', { id });
      }),
      map((response: ApiResponse<Employee>) => response.result!),
      catchError((error) => {
        this.logger.error('Facade: failed to activate employee', error);
        this.store.setError('Failed to activate employee');
        throw error;
      }),
    );
  }

  /**
   * Deactivate employee
   */
  deactivateEmployee(id: string, comments?: string): Observable<Employee> {
    this.logger.debug('Facade: deactivating employee', { id });

    return this.employeeApi.deactivateEmployee(id, comments).pipe(
      tap((response: ApiResponse<Employee>) => {
        this.logger.info('Facade: employee deactivated', { id });
      }),
      map((response: ApiResponse<Employee>) => response.result!),
      catchError((error) => {
        this.logger.error('Facade: failed to deactivate employee', error);
        this.store.setError('Failed to deactivate employee');
        throw error;
      }),
    );
  }
}
