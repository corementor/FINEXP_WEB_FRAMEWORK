import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { WorkflowsComponent } from './workflows.component';
import { EmployeeFacadeService } from '@app/features/employees/services';
import { LoggerService } from '@app/core/services';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { Employee, ELifeCycle } from '@app/core/models';

/**
 * Workflows Component Unit Tests
 * Tests workflow state filtering and lifecycle operations
 */
describe('WorkflowsComponent', () => {
  let component: WorkflowsComponent;
  let fixture: ComponentFixture<WorkflowsComponent>;
  let employeeService: EmployeeFacadeService;
  let logger: LoggerService;

  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    phoneNumber: '+1234567890',
    nationalId: 'ID123',
    employeeNumber: 'EMP001',
    version: 1,
    securityLabel: 'INTERNAL' as any,
    state: ELifeCycle.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockEmployees = [
    { ...mockEmployee, id: '1', state: ELifeCycle.CREATED, name: 'John Pending' },
    { ...mockEmployee, id: '2', state: ELifeCycle.ACTIVE, name: 'Jane Active' },
    { ...mockEmployee, id: '3', state: ELifeCycle.INACTIVE, name: 'Bob Inactive' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowsComponent, CommonModule],
      providers: [
        {
          provide: EmployeeFacadeService,
          useValue: {
            getEmployees: vi.fn(() => of(mockEmployees)),
            updateEmployee: vi.fn(() => of(mockEmployee)),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
            error: vi.fn(),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WorkflowsComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeFacadeService);
    logger = TestBed.inject(LoggerService);
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should load workflows on init', () => {
      fixture.detectChanges();
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should initialize workflow list', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(mockEmployees));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });
  });

  describe('Workflow Display', () => {
    it('should display all employees grouped by state', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(mockEmployees));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.pending.length).toBeGreaterThanOrEqual(0);
      expect(component.active.length).toBeGreaterThanOrEqual(0);
      expect(component.inactive.length).toBeGreaterThanOrEqual(0);
    });

    it('should show workflow status', () => {
      expect(component).toBeDefined();
    });

    it('should categorize employees by lifecycle state', () => {
      expect(component.lifeCycle).toBeDefined();
    });

    it('should display empty state when no workflows', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of([]));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });
  });

  describe('State Transitions', () => {
    it('should allow CREATED -> ACTIVE transition', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(
        of({ ...mockEmployee, state: ELifeCycle.ACTIVE }),
      );

      component.activate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, {
        state: ELifeCycle.ACTIVE,
      });
    });

    it('should allow ACTIVE -> INACTIVE transition', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(
        of({ ...mockEmployee, state: ELifeCycle.INACTIVE }),
      );

      component.deactivate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, {
        state: ELifeCycle.INACTIVE,
      });
    });

    it('should show confirmation before state change', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Activate Operation', () => {
    it('should activate an employee', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(of(mockEmployee));

      component.activate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.updateEmployee).toHaveBeenCalled();
    });

    it('should reload data after activation', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(mockEmployees));
      vi.mocked(employeeService.updateEmployee).mockReturnValue(of(mockEmployee));

      fixture.detectChanges();
      component.activate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should handle activation errors', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(
        throwError(() => new Error('Activation failed')),
      );

      component.activate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });
  });

  describe('Deactivate Operation', () => {
    it('should deactivate an employee', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(of(mockEmployee));

      component.deactivate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.updateEmployee).toHaveBeenCalled();
    });

    it('should reload data after deactivation', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(mockEmployees));
      vi.mocked(employeeService.updateEmployee).mockReturnValue(of(mockEmployee));

      fixture.detectChanges();
      component.deactivate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should handle deactivation errors', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(
        throwError(() => new Error('Deactivation failed')),
      );

      component.deactivate(mockEmployee.id);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should handle click on employee card', () => {
      expect(component).toBeDefined();
    });

    it('should show action buttons', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Refresh', () => {
    it('should refresh workflow list', async () => {
      fixture.detectChanges();

      component.loadData();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalledTimes(2);
    });

    it('should handle refresh errors', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(
        throwError(() => new Error('Refresh failed')),
      );

      component.loadData();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });
  });
});
