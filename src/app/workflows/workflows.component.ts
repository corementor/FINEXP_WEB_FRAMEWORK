import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeFacadeService, EmployeeMutationService } from '@app/features/employees/services';
import { Employee, ELifeCycle } from '@app/core/models';
import { LoggerService } from '@app/core/services';
import { ButtonComponent, SpinnerComponent } from '@app/shared/components';

@Component({
  selector: 'app-workflows',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonComponent, SpinnerComponent],
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss'],
})
export class WorkflowsComponent implements OnInit, OnDestroy {
  private readonly employeeFacade = inject(EmployeeFacadeService);
  private readonly mutationService = inject(EmployeeMutationService);
  private readonly logger = inject(LoggerService);
  private readonly destroy$ = new Subject<void>();

  readonly lifeCycle = ELifeCycle;

  private readonly employeesQueryKey = ['employees'];

  readonly employeesQuery = injectQuery(() => ({
    queryKey: this.employeesQueryKey,
    queryFn: () => firstValueFrom(this.employeeFacade.getEmployees(0, 100)),
  }));

  // ===== MUTATIONS =====
  // Separated from component for cleaner architecture
  readonly activateMutation = this.mutationService.activateMutation(
    () => {
      this.logger.info('Employee activated');
    },
    (err) => {
      this.logger.error('Failed to activate', err);
    },
  );

  readonly deactivateMutation = this.mutationService.deactivateMutation(
    () => {
      this.logger.info('Employee deactivated');
    },
    (err) => {
      this.logger.error('Failed to deactivate', err);
    },
  );

  get pending(): Employee[] {
    return (this.employeesQuery.data() || []).filter((e) => e.state === ELifeCycle.CREATED);
  }

  get active(): Employee[] {
    return (this.employeesQuery.data() || []).filter((e) => e.state === ELifeCycle.ACTIVE);
  }

  get inactive(): Employee[] {
    return (this.employeesQuery.data() || []).filter((e) => e.state === ELifeCycle.INACTIVE);
  }

  get isLoading(): boolean {
    return this.employeesQuery.isPending();
  }

  get error(): string | null {
    return this.employeesQuery.error() ? 'Failed to load workflow data' : null;
  }

  ngOnInit(): void {
    // Query will auto-fetch via signals with caching
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRefresh(): void {
    this.employeesQuery.refetch();
  }

  /**
   * Activate employee through mutation service
   * Cache invalidation is handled by the mutation service
   */
  activate(id: string): void {
    this.activateMutation.mutate(id);
  }

  /**
   * Deactivate employee through mutation service
   * Cache invalidation is handled by the mutation service
   */
  deactivate(id: string): void {
    this.deactivateMutation.mutate({ id });
  }
}
