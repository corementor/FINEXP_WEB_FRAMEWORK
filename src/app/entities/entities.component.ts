import {
  Component,
  effect,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';

import { EmployeeFacadeService, EmployeeMutationService } from '@app/features/employees/services';
import { Employee, ELifeCycle, ESecurityLabel } from '@app/core/models';
import { LoggerService } from '@app/core/services';
import { APP_UI_COMPONENTS, TableColumn } from '@app/shared/components/ui-base';

@Component({
  selector: 'app-entities',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ...APP_UI_COMPONENTS],
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
})
export class EntitiesComponent implements OnInit {
  private readonly employeeFacade = inject(EmployeeFacadeService);
  private readonly mutationService = inject(EmployeeMutationService);
  private readonly logger = inject(LoggerService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);

  @ViewChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;

  private readonly employeeQueryKey = ['employees'];

  readonly employeesQuery = injectQuery(() => ({
    queryKey: this.employeeQueryKey,
    queryFn: () => firstValueFrom(this.employeeFacade.getEmployees(0, 100)),
  }));

  // ===== MUTATIONS =====
  // Mutations are defined in EmployeeMutationService for separation of concerns
  // Components only call the service methods and pass side-effect handlers

  readonly createEmployeeMutation = this.mutationService.createMutation(
    // onSuccess callback
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee created successfully',
        life: 3000,
      });
      this.closeModal();
    },
    // onError callback
    (error) => {
      this.error = 'Failed to create employee';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error,
        life: 3000,
      });
    },
  );

  readonly updateEmployeeMutation = this.mutationService.updateMutation(
    // onSuccess callback
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee updated successfully',
        life: 3000,
      });
      if (this.isEditMode) {
        this.closeModal();
      }
    },
    // onError callback
    (error) => {
      this.error = 'Failed to update employee';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error,
        life: 3000,
      });
    },
  );

  readonly activateEmployeeMutation = this.mutationService.activateMutation(
    // onSuccess callback
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee activated successfully',
        life: 3000,
      });
      this.logger.info('Employee activated successfully');
    },
    // onError callback
    (error) => {
      this.error = 'Failed to activate employee';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error,
        life: 3000,
      });
    },
  );

  readonly deactivateEmployeeMutation = this.mutationService.deactivateMutation(
    // onSuccess callback
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee deactivated successfully',
        life: 3000,
      });
      this.logger.info('Employee deactivated successfully');
    },
    // onError callback
    (error) => {
      this.error = 'Failed to deactivate employee';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error,
        life: 3000,
      });
    },
  );

  readonly deleteMutation = this.mutationService.deleteMutation(
    // onSuccess callback
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee deleted successfully',
        life: 3000,
      });
      this.logger.info('Employee deleted successfully');
    },
    // onError callback
    (error) => {
      this.error = 'Failed to delete employee';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error,
        life: 3000,
      });
    },
  );

  // ===== COMPONENT STATE =====

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  isLoading = false;
  error: string | null = null;
  showModal = false;
  isEditMode = false;
  selectedEmployeeId: string | null = null;
  searchQuery = '';
  securityLabelFilter = 'All';

  employeeForm: FormGroup;

  lifeCycle = ELifeCycle;
  securityLabel = ESecurityLabel;
  securityLabels = Object.values(ESecurityLabel);

  readonly employeeColumns: TableColumn<Employee>[] = [
    { field: 'name', header: 'Employee', sortable: true },
    { field: 'emailAddress', header: 'Contact', sortable: true },
    { field: 'securityLabel', header: 'Security', sortable: true },
    { field: 'state', header: 'Status', sortable: true },
    { field: 'version', header: 'Version', sortable: false },
  ];

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      nationalId: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      securityLabel: [ESecurityLabel.INTERNAL, Validators.required],
      comments: [''],
    });

    effect(() => {
      const queryEmployees = this.employeesQuery.data() ?? [];
      this.employees = queryEmployees;
      this.applyFilters();

      const queryIsLoading = this.employeesQuery.isPending() || this.employeesQuery.isFetching();
      const mutationIsLoading =
        this.createEmployeeMutation.isPending() || this.updateEmployeeMutation.isPending();
      this.isLoading = queryIsLoading || mutationIsLoading;

      const queryError = this.employeesQuery.error();
      if (queryError) {
        this.error = this.getErrorMessage(queryError);
      }

      // Notify Angular to re-check the view after effect updates properties
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.error = null;
    this.employeesQuery.refetch();
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.employeeNumber.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesLabel =
        this.securityLabelFilter === 'All' || emp.securityLabel === this.securityLabelFilter;
      return matchesSearch && matchesLabel;
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onLabelFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    this.securityLabelFilter = target?.value || 'All';
    this.applyFilters();
  }

  getCount(state: ELifeCycle): number {
    return this.employees.filter((e) => e.state === state).length;
  }

  // ===== MODAL MANAGEMENT =====

  openCreateModal(): void {
    this.error = null;
    this.isEditMode = false;
    this.selectedEmployeeId = null;
    this.employeeForm.reset({
      firstName: '',
      lastName: '',
      securityLabel: ESecurityLabel.INTERNAL,
    });
    this.showModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(employee: Employee): void {
    this.error = null;
    this.isEditMode = true;
    this.selectedEmployeeId = employee.id;
    const [firstName = '', ...rest] = (employee.name || '').trim().split(/\s+/);
    this.employeeForm.patchValue({
      firstName,
      lastName: rest.join(' '),
      employeeNumber: employee.employeeNumber,
      nationalId: employee.nationalId,
      emailAddress: employee.emailAddress,
      securityLabel: employee.securityLabel,
      comments: employee.comments,
    });
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly',
        life: 3000,
      });
      return;
    }

    const formValue = this.employeeForm.getRawValue();
    const name = `${formValue.firstName?.trim() || ''} ${formValue.lastName?.trim() || ''}`.trim();

    const employeeData = {
      name,
      employeeNumber: formValue.employeeNumber,
      nationalId: formValue.nationalId,
      emailAddress: formValue.emailAddress,
      securityLabel: formValue.securityLabel,
      comments: formValue.comments,
    } as Omit<Employee, 'id' | 'version' | 'createdAt' | 'updatedAt'>;

    if (this.isEditMode && this.selectedEmployeeId) {
      this.updateEmployeeMutation.mutate(
        {
          id: this.selectedEmployeeId,
          updates: employeeData,
        },
        {
          onError: () => {
            this.error = 'Failed to update employee';
          },
        },
      );
    } else {
      this.createEmployeeMutation.mutate(employeeData);
    }
  }

  activate(id: string): void {
    this.activateEmployeeMutation.mutate(id);
  }

  deactivate(id: string, comments?: string): void {
    if (confirm('Are you sure you want to deactivate this employee?')) {
      this.deactivateEmployeeMutation.mutate({ id, comments });
    }
  }

  delete(id: string): void {
    this.showDeleteConfirmation(id);
  }

  private showDeleteConfirmation(id: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Confirm Delete',
      detail: 'Are you sure you want to delete this employee? This action cannot be undone.',
      sticky: true,
      closable: true,
    });
    // Keep the confirmation dialog approach or use confirmation service
    // For now, using browser confirm to maintain logic
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.deleteMutation.mutate(id);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Failed to load employees';
  }

  getStatusClass(state: ELifeCycle): string {
    switch (state) {
      case ELifeCycle.ACTIVE:
        return 'bg-green-100 text-green-700';
      case ELifeCycle.CREATED:
        return 'bg-blue-100 text-blue-700';
      case ELifeCycle.INACTIVE:
        return 'bg-red-100 text-red-700';
      default:
        return '';
    }
  }

  getSecurityLabelClass(label: ESecurityLabel): string {
    switch (label) {
      case ESecurityLabel.PUBLIC:
        return 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-600';
      case ESecurityLabel.INTERNAL:
        return 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case ESecurityLabel.RESTRICTED:
        return 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-700';
      case ESecurityLabel.CONFIDENTIAL:
        return 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 border-red-200 dark:border-red-700';
      default:
        return '';
    }
  }
}
