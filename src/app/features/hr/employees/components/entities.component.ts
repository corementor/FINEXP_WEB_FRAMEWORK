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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import {
  EmployeeFacadeService,
  EmployeeMutationService,
} from '@app/features/hr/employees/services';
import { Employee, ELifeCycle, ESecurityLabel } from '@app/core/models';
import {
  FileDownloadService,
  LoggerService,
  ReportApiService,
  type ReportFormat,
} from '@app/core/services';
import {
  APP_UI_COMPONENTS,
  AppTableComponent,
  TableColumn,
  FormConfig,
  SelectOption,
} from '@app/shared/components/ui-base';

@Component({
  selector: 'app-entities',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ...APP_UI_COMPONENTS,
  ],
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
  private readonly confirmationService = inject(ConfirmationService);
  private readonly reportApi = inject(ReportApiService);
  private readonly fileDownload = inject(FileDownloadService);

  @ViewChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;
  @ViewChild('employeesTable') employeesTable?: AppTableComponent<Employee>;

  private readonly employeeQueryKey = ['employees'];

  readonly securityLabelOptions: SelectOption[] = Object.values(ESecurityLabel).map((v) => ({
    label: v,
    value: v,
  }));

  readonly employeeFormConfig: FormConfig = {
    columns: 2,
    fields: [
      {
        key: 'firstName',
        type: 'text',
        label: 'First Name',
        placeholder: 'e.g. John',
        required: true,
      },
      {
        key: 'lastName',
        type: 'text',
        label: 'Last Name',
        placeholder: 'e.g. Doe',
        required: true,
      },
      {
        key: 'employeeNumber',
        type: 'text',
        label: 'Employee Number',
        placeholder: 'e.g. EMP-001',
        required: true,
      },
      {
        key: 'nationalId',
        type: 'text',
        label: 'National ID',
        placeholder: 'National ID',
        required: true,
      },
      {
        key: 'emailAddress',
        type: 'email',
        label: 'Email Address',
        placeholder: 'email@example.com',
        required: true,
      },
      {
        key: 'securityLabel',
        type: 'select',
        label: 'Security Label',
        required: true,
        colSpan: 2,
        options: Object.values(ESecurityLabel).map((v) => ({ label: v, value: v })),
      },
      {
        key: 'comments',
        type: 'textarea',
        label: 'Comments',
        placeholder: 'Optional comments...',
        colSpan: 2,
      },
    ],
  };

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

  readonly bulkDeleteMutation = this.mutationService.bulkDeleteMutation(
    // onSuccess callback
    () => {
      this.selectedEmployees = [];
      this.employeesTable?.clearSelection();
      this.logger.info('Selected employees deleted successfully');
      this.cdr.markForCheck();
    },
    // onError callback
    () => {
      this.error = 'Failed to delete the selected employees';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error,
        life: 3000,
      });
      this.cdr.markForCheck();
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
  exportingFormat: ReportFormat | null = null;
  selectedEmployees: Employee[] = [];

  employeeForm: FormGroup;

  lifeCycle = ELifeCycle;
  securityLabel = ESecurityLabel;
  securityLabels = Object.values(ESecurityLabel);

  get modalHeader(): string {
    return this.isEditMode ? 'Edit Employee' : 'Create New Employee';
  }

  get modalHeaderIcon(): string {
    return this.isEditMode ? 'pi-user-edit' : 'pi-user-plus';
  }

  get submitLabel(): string {
    return this.isEditMode ? 'Update' : 'Create';
  }

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

  // ===== SELECTION =====

  /**
   * Keep track of the employees checked in the table.
   */
  onSelectionChange(employees: Employee[]): void {
    this.selectedEmployees = employees ?? [];
    this.cdr.markForCheck();
  }

  get selectedCount(): number {
    return this.selectedEmployees.length;
  }

  get exportLabelSuffix(): string {
    return this.selectedCount > 0 ? ` (${this.selectedCount})` : '';
  }

  /**
   * Delete the employees selected from the table toolbar, already confirmed there.
   */
  bulkDeleteFromTable(employees: Employee[]): void {
    const ids = (employees ?? []).map((employee) => employee.id);
    if (ids.length === 0) {
      return;
    }

    this.error = null;
    this.bulkDeleteMutation.mutate(ids);
  }

  /**
   * Delete every employee currently selected in the table.
   */
  bulkDelete(): void {
    const ids = this.selectedEmployees.map((employee) => employee.id);
    if (ids.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${ids.length} selected employee(s)?`,
      header: 'Confirm deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      rejectButtonProps: { severity: 'secondary', label: 'Cancel', variant: 'text' },
      accept: () => {
        this.error = null;
        this.bulkDeleteMutation.mutate(ids);
      },
    });
  }

  // ===== REPORTING =====

  /**
   * Download the employee report generated by the backend Jasper engine.
   * Only the employees selected in the table are reported, when there is a selection.
   */
  exportReport(format: ReportFormat = 'PDF'): void {
    if (this.exportingFormat) {
      return;
    }

    const ids = this.selectedEmployees.map((employee) => employee.id);

    this.exportingFormat = format;
    this.cdr.markForCheck();

    this.reportApi.getEmployeeReport(format, false, ids).subscribe({
      next: ({ blob, fileName }) => {
        this.fileDownload.saveBlob(blob, fileName);
        this.exportingFormat = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Report ready',
          detail: `${fileName} has been downloaded`,
          life: 3000,
        });
        this.logger.info('Employee report downloaded', { fileName, selected: ids.length });
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.exportingFormat = null;
        this.logger.error('Failed to generate the employee report', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate the employee report',
          life: 3000,
        });
        this.cdr.markForCheck();
      },
    });
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

  onSubmit(formValue?: Record<string, any>): void {
    const value = formValue ?? this.employeeForm.getRawValue();
    const name = `${value['firstName']?.trim() || ''} ${value['lastName']?.trim() || ''}`.trim();

    const employeeData = {
      name,
      employeeNumber: value['employeeNumber'],
      nationalId: value['nationalId'],
      emailAddress: value['emailAddress'],
      securityLabel: value['securityLabel'],
      comments: value['comments'],
    } as Omit<Employee, 'id' | 'version' | 'createdAt' | 'updatedAt'>;

    if (this.isEditMode && this.selectedEmployeeId) {
      this.updateEmployeeMutation.mutate(
        { id: this.selectedEmployeeId, updates: employeeData },
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate this employee?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deactivateEmployeeMutation.mutate({ id, comments });
      },
    });
  }

  delete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this employee? This action cannot be undone.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMutation.mutate(id);
      },
    });
  }

  private showDeleteConfirmation(id: string): void {
    // This method is no longer used - using PrimeNG confirmationService instead
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
