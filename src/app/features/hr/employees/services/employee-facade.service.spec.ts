import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { EmployeeApiService, LoggerService } from '@app/core/services';
import { AppStateStore } from '@app/core/state';
import { EmployeeFacadeService } from './employee-facade.service';
import { MockApiService } from '@app/core/testing/mock-api.service';
import { createMockEmployee } from '@app/core/testing/test-helpers';

describe('EmployeeFacadeService', () => {
  let service: EmployeeFacadeService;
  let employeeApi: EmployeeApiService;
  let store: AppStateStore;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeFacadeService,
        EmployeeApiService,
        MockApiService,
        LoggerService,
        AppStateStore,
      ],
    });

    service = TestBed.inject(EmployeeFacadeService);
    employeeApi = TestBed.inject(EmployeeApiService);
    store = TestBed.inject(AppStateStore);
    logger = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with valid state', () => {
    expect(service).toBeTruthy();
  });

  describe('Service methods', () => {
    it('should have getEmployees method', () => {
      expect(typeof service.getEmployees).toBe('function');
    });

    it('should have getEmployeeById method', () => {
      expect(typeof service.getEmployeeById).toBe('function');
    });

    it('should have createEmployee method', () => {
      expect(typeof service.createEmployee).toBe('function');
    });

    it('should have updateEmployee method', () => {
      expect(typeof service.updateEmployee).toBe('function');
    });

    it('should have deleteEmployee method', () => {
      expect(typeof service.deleteEmployee).toBe('function');
    });

    it('should have searchEmployees method', () => {
      expect(typeof service.searchEmployees).toBe('function');
    });
  });

  describe('Mock API Integration', () => {
    it('should use MockApiService for testing', async () => {
      const mockApi = TestBed.inject(MockApiService);
      const mockEmployees = [createMockEmployee({ id: '1' }), createMockEmployee({ id: '2' })];

      const employees = await new Promise<any>((resolve) => {
        mockApi.getEmployees(0, 10).subscribe((response) => {
          resolve(response.result);
        });
      });

      expect(Array.isArray(employees)).toBe(true);
    });

    it('should support employee creation through mock API', async () => {
      const mockApi = TestBed.inject(MockApiService);
      const newEmployee = createMockEmployee({ id: 'new-1' });

      const created = await new Promise<any>((resolve) => {
        mockApi.createEmployee(newEmployee).subscribe((response) => {
          resolve(response.result);
        });
      });

      expect(created).toBeDefined();
      expect(created.name).toBe(newEmployee.name);
    });
  });

  describe('Error handling', () => {
    it('should define store setError method for error handling', () => {
      expect(typeof store.setError).toBe('function');
    });

    it('should define logger error method', () => {
      expect(typeof logger.error).toBe('function');
    });
  });
});
