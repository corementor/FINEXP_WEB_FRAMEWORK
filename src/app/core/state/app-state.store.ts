import { Injectable, signal, computed } from '@angular/core';
import { Employee, AuditLog } from '../models/domain.models';

/**
 * Signals-based State Management Store
 * Centralized state for the application using Angular Signals
 */
@Injectable({
  providedIn: 'root'
})
export class AppStateStore {
  // State signals
  private employeesSignal = signal<Employee[]>([]);
  private selectedEmployeeSignal = signal<Employee | null>(null);
  private auditLogsSignal = signal<AuditLog[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly employees = this.employeesSignal.asReadonly();
  readonly selectedEmployee = this.selectedEmployeeSignal.asReadonly();
  readonly auditLogs = this.auditLogsSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals
  readonly employeeCount = computed(() => this.employeesSignal().length);
  readonly hasError = computed(() => this.errorSignal() !== null);
  readonly activeEmployees = computed(() =>
    this.employeesSignal().filter(emp => emp.status === 'active')
  );
  readonly inactiveEmployees = computed(() =>
    this.employeesSignal().filter(emp => emp.status === 'inactive')
  );

  /**
   * Set employees list
   */
  setEmployees(employees: Employee[]): void {
    this.employeesSignal.set(employees);
  }

  /**
   * Add employee to list
   */
  addEmployee(employee: Employee): void {
    this.employeesSignal.update(emp => [...emp, employee]);
  }

  /**
   * Update employee in list
   */
  updateEmployee(id: string, employee: Partial<Employee>): void {
    this.employeesSignal.update(employees =>
      employees.map(emp =>
        emp.id === id ? { ...emp, ...employee } : emp
      )
    );
  }

  /**
   * Remove employee from list
   */
  removeEmployee(id: string): void {
    this.employeesSignal.update(employees =>
      employees.filter(emp => emp.id !== id)
    );
  }

  /**
   * Set selected employee
   */
  selectEmployee(employee: Employee | null): void {
    this.selectedEmployeeSignal.set(employee);
  }

  /**
   * Set audit logs
   */
  setAuditLogs(logs: AuditLog[]): void {
    this.auditLogsSignal.set(logs);
  }

  /**
   * Add audit log entry
   */
  addAuditLog(log: AuditLog): void {
    // Insert at beginning to show most recent first
    this.auditLogsSignal.update(logs => [log, ...logs]);
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  /**
   * Clear all state
   */
  reset(): void {
    this.employeesSignal.set([]);
    this.selectedEmployeeSignal.set(null);
    this.auditLogsSignal.set([]);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
  }
}
