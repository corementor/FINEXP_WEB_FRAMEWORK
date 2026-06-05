import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { CardComponent, ButtonComponent, SpinnerComponent } from '@app/shared/components';
import { AuditApiService, LoggerService } from '@app/core/services';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { ApiResponse } from '@app/core/models';

@Component({
  selector: 'app-employee-audit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CardComponent, SpinnerComponent],
  templateUrl: './employee-audit.component.html',
  styleUrl: './employee-audit.component.scss',
})
export class EmployeeAuditComponent implements OnInit, OnDestroy {
  private readonly auditApi = inject(AuditApiService);
  private readonly logger = inject(LoggerService);
  private readonly route = inject(ActivatedRoute);
  private readonly queryClient = inject(QueryClient);
  private readonly toast = inject(ToastService);
  private readonly destroy$ = new Subject<void>();

  employeeId: string = '';
  employeeName: string = '';

  private readonly getAuditQueryKey = (id: string) => ['employee-audit', id];

  auditQuery = injectQuery(() => ({
    queryKey: this.getAuditQueryKey(this.employeeId),
    queryFn: () =>
      firstValueFrom(this.auditApi.getEmployeeAuditTrail(this.employeeId, 0, 100)).then(
        (response: ApiResponse<any[]>) => {
          const events = response.result || [];
          return events.map((event: any) => ({
            id: event.id,
            timestamp: event.actionDate,
            actionTime: event.actionTime,
            employee: event.auditedObject?.name || 'Unknown',
            employeeNumber: event.auditedObject?.employeeNumber,
            nationalId: event.auditedObject?.nationalId,
            email: event.auditedObject?.emailAddress,
            state: event.auditedObject?.state,
            department: event.auditedObject?.department,
            phoneNumber: event.auditedObject?.phoneNumber,
            action: this.getActionLabel(event),
            description: this.getActionDescription(event),
            details: event.auditedObject,
          }));
        },
      ),
    enabled: !!this.employeeId,
  }));

  get auditLogs(): any[] {
    return this.auditQuery.data() || [];
  }

  get isLoading(): boolean {
    return this.auditQuery.isPending();
  }

  get error(): string | null {
    return this.auditQuery.error() ? 'Failed to load audit trail' : null;
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      this.employeeId = params['employeeId'];
      // Show info toast when loading audit trail
      if (this.employeeId) {
        this.toast.info('Info', 'Loading audit trail...');
      }
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((queryParams: any) => {
      if (queryParams['name']) {
        this.employeeName = queryParams['name'];
      }
    });
  }

  /**
   * Get action label based on lifecycle state
   */
  private getActionLabel(event: any): string {
    const state = event.auditedObject?.state;
    switch (state) {
      case 'CREATED':
        return 'Created';
      case 'ACTIVE':
        return 'Activated';
      case 'INACTIVE':
        return 'Deactivated';
      case 'ARCHIVED':
        return 'Archived';
      default:
        return 'Modified';
    }
  }

  /**
   * Get action description
   */
  private getActionDescription(event: any): string {
    const employee = event.auditedObject;
    if (!employee) return 'No details available';

    return `${employee.name} (${employee.employeeNumber}) - Status: ${employee.state}`;
  }

  /**
   * Get CSS classes for state badge
   */
  getStateBadgeClass(state: string): string {
    switch (state) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'CREATED':
        return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
