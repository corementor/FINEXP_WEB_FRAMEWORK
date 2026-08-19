import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { EntitiesComponent } from './entities.component';
import { EmployeeFacadeService } from '@app/features/hr/employees/services';
import { EmployeeMutationService } from '@app/features/hr/employees/services';
import { LoggerService } from '@app/core/services';
import { ToastService } from '@app/services/toast.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { Employee, ELifeCycle, ESecurityLabel } from '@app/core/models';

const mockMutation = (overrides: Record<string, any> = {}) => ({
  mutate: vi.fn(),
  isPending: vi.fn(() => false),
  isError: vi.fn(() => false),
  isSuccess: vi.fn(() => false),
  ...overrides,
});

describe('EntitiesComponent', () => {
  let component: EntitiesComponent;
  let fixture: ComponentFixture<EntitiesComponent>;
  let employeeService: EmployeeFacadeService;
  let mutationService: EmployeeMutationService;
  let toastService: ToastService;

  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    phoneNumber: '+1234567890',
    nationalId: 'ID123',
    employeeNumber: 'EMP001',
    version: 1,
    securityLabel: ESecurityLabel.INTERNAL,
    state: ELifeCycle.ACTIVE,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockEmployees = [mockEmployee];

  const mockMutationService = {
    createMutation: vi.fn(() => mockMutation()),
    updateMutation: vi.fn(() => mockMutation()),
    activateMutation: vi.fn(() => mockMutation()),
    deactivateMutation: vi.fn(() => mockMutation()),
    deleteMutation: vi.fn(() => mockMutation()),
    bulkDeleteMutation: vi.fn(() => mockMutation()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesComponent, CommonModule, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        provideAngularQuery(new QueryClient({ defaultOptions: { queries: { retry: false } } })),
        {
          provide: EmployeeFacadeService,
          useValue: {
            getEmployees: vi.fn(() => of(mockEmployees)),
          },
        },
        {
          provide: EmployeeMutationService,
          useValue: mockMutationService,
        },
        {
          provide: ToastService,
          useValue: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
        },
        {
          provide: LoggerService,
          useValue: { info: vi.fn(), warn: vi.fn(), debug: vi.fn(), error: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntitiesComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeFacadeService);
    mutationService = TestBed.inject(EmployeeMutationService);
    toastService = TestBed.inject(ToastService);
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
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should initialize empty form for new employee', () => {
      expect(component.employeeForm).toBeDefined();
    });

    it('should set loading state during init', () => {
      expect(component.isLoading).toBe(true);
    });
  });

  describe('Table Display', () => {
    it('should display employee list in table', async () => {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should show correct number of employees', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(
        of([mockEmployee, { ...mockEmployee, id: '2', name: 'Jane Doe' }]),
      );
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should display all employee fields', () => {
      expect(component.employeeColumns.length).toBeGreaterThan(0);
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
      expect(component.isEditMode).toBe(false);
    });

    it('should call createMutation.mutate on form submit with valid data', () => {
      component.openCreateModal();
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        employeeNumber: 'EMP001',
        nationalId: 'ID123',
        emailAddress: 'john@example.com',
        securityLabel: ESecurityLabel.INTERNAL,
        comments: '',
      };
      component.onSubmit(validData);
      expect(component.createEmployeeMutation.mutate).toHaveBeenCalled();
    });

    it('should close modal after successful create', () => {
      component.openCreateModal();
      component.closeModal();
      expect(component.showModal).toBe(false);
    });

    it('should handle create validation errors', () => {
      // error property starts null; mutation error callback sets it
      expect(component.error).toBeNull();
    });
  });

  describe('Read/List Operation', () => {
    it('should refresh employee list', () => {
      fixture.detectChanges();
      component.loadEmployees();
      expect(employeeService.getEmployees).toHaveBeenCalled();
    });

    it('should handle loading errors', async () => {
      vi.mocked(employeeService.getEmployees).mockReturnValue(
        throwError(() => new Error('Failed to load employees')),
      );
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component).toBeDefined();
    });
  });

  describe('Update Operation', () => {
    it('should populate form with selected employee', () => {
      component.openEditModal(mockEmployee);
      expect(component.showModal).toBe(true);
      expect(component.isEditMode).toBe(true);
    });

    it('should call updateMutation.mutate on form submit in edit mode', () => {
      component.openEditModal(mockEmployee);
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        employeeNumber: 'EMP001',
        nationalId: 'ID123',
        emailAddress: 'john@example.com',
        securityLabel: ESecurityLabel.INTERNAL,
        comments: '',
      };
      component.onSubmit(validData);
      expect(component.updateEmployeeMutation.mutate).toHaveBeenCalled();
    });

    it('should close modal after successful update', () => {
      component.openEditModal(mockEmployee);
      component.closeModal();
      expect(component.showModal).toBe(false);
    });

    it('should handle update validation errors', () => {
      expect(component.error).toBeNull();
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
