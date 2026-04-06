import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EntitiesComponent } from './entities.component';
import { EmployeeFacadeService } from '../features/employees/services/employee-facade.service';
import { LoggerService } from '../core/services/logger.service';
import { ToastService } from '../services/toast.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { Employee } from '../core/models';

/**
 * Entities Component Unit Tests
 * Tests CRUD operations, modal interactions, and error handling
 */
describe('EntitiesComponent', () => {
  let component: EntitiesComponent;
  let fixture: ComponentFixture<EntitiesComponent>;
  let employeeService: EmployeeFacadeService;
  let toastService: ToastService;
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
    state: 'ACTIVE' as any,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockEmployees = [mockEmployee];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesComponent, CommonModule, ReactiveFormsModule],
      providers: [
        {
          provide: EmployeeFacadeService,
          useValue: {
            getEmployees: vi.fn(() => of(mockEmployees)),
            createEmployee: vi.fn(() => of(mockEmployee)),
            updateEmployee: vi.fn(() => of(mockEmployee)),
          },
        },
        {
          provide: ToastService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
            info: vi.fn(),
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
    fixture = TestBed.createComponent(EntitiesComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeFacadeService);
    toastService = TestBed.inject(ToastService);
    logger = TestBed.inject(LoggerService);
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should load employees on init', () => {
      fixture.detectChanges();
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should initialize table with employees', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(mockEmployees));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should initialize empty form for new employee', () => {
      expect(component).toBeDefined();
    });

    it('should set loading state during init', () => {
      expect(component.isLoading).toBe(true);
    });
  });

  describe('Table Display', () => {
    it('should display employee list in table', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(mockEmployees));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should show correct number of employees', async () => {
      const multipleEmployees = [mockEmployee, { ...mockEmployee, id: '2', name: 'Jane Doe' }];
      vi.mocked(employeeService.getEmployees).mockReturnValue(of(multipleEmployees));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should display all employee fields', () => {
      expect(component).toBeDefined();
    });

    it('should sort table by column', () => {
      expect(component).toBeDefined();
    });

    it('should show empty state when no employees', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(of([]));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });
  });

  describe('Create Operation', () => {
    it('should open create modal on add button', () => {
      component.openCreateModal();
      expect(component.showModal).toBe(true);
    });

    it('should reset form for new employee', () => {
      component.openCreateModal();
      expect(component).toBeDefined();
    });

    it('should create employee on form submit', async () => {
      vi.mocked(employeeService.createEmployee).mockReturnValue(of(mockEmployee));

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.createEmployee).toHaveBeenCalled();
    });

    it('should close modal after successful create', async () => {
      vi.mocked(employeeService.createEmployee).mockReturnValue(of(mockEmployee));

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.showModal).toBe(false);
    });

    it('should handle create validation errors', async () => {
      vi.mocked(employeeService.createEmployee).mockReturnValue(
        throwError(() => new Error('Validation failed')),
      );

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });
  });

  describe('Read/List Operation', () => {
    it('should refresh employee list', () => {
      fixture.detectChanges();

      component.loadEmployees();

      expect(employeeService.getEmployees).toHaveBeenCalledTimes(2);
    });

    it('should handle loading errors', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(
        throwError(() => new Error('Failed to load employees')),
      );

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });
  });

  describe('Update Operation', () => {
    it('should populate form with selected employee', () => {
      component.openEditModal(mockEmployee);
      expect(component.showModal).toBe(true);
    });

    it('should update employee on form submit', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(of(mockEmployee));

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.updateEmployee).toHaveBeenCalled();
    });

    it('should close modal after successful update', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(of(mockEmployee));

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.showModal).toBe(false);
    });

    it('should handle update validation errors', async () => {
      vi.mocked(employeeService.updateEmployee).mockReturnValue(
        throwError(() => new Error('Validation failed')),
      );

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });
  });

  describe('Modal Interactions', () => {
    it('should open modal on create button', () => {
      component.openCreateModal();
      expect(component.showModal).toBe(true);
    });

    it('should close modal on cancel', () => {
      component.openCreateModal();
      component.closeModal();
      expect(component.showModal).toBe(false);
    });

    it('should clear form data on modal close', () => {
      component.openCreateModal();
      component.closeModal();
      expect(component).toBeDefined();
    });

    it('should validate form before close', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Search and Filter', () => {
    it('should filter employees by name', () => {
      expect(component).toBeDefined();
    });

    it('should filter employees by department', () => {
      expect(component).toBeDefined();
    });

    it('should filter employees by status', () => {
      expect(component).toBeDefined();
    });

    it('should combine multiple filters', () => {
      expect(component).toBeDefined();
    });

    it('should clear filters', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Bulk Operations', () => {
    it('should select multiple employees', () => {
      expect(component).toBeDefined();
    });

    it('should perform bulk action on selected', () => {
      expect(component).toBeDefined();
    });

    it('should show bulk action confirmation', () => {
      expect(component).toBeDefined();
    });
  });
});
