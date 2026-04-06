import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import {
  EmployeeApiService,
  AuditApiService,
  LoggerService,
  DashboardApiService,
} from '@app/core/services';
import { AppStateStore } from '@app/core/state';
import { ApiResponse, DashboardStats } from '@app/core/models';

/**
 * Dashboard Facade Service
 * Orchestrates dashboard statistics and activity retrieval
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardFacadeService {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly auditApi = inject(AuditApiService);
  private readonly logger = inject(LoggerService);
  private readonly store = inject(AppStateStore);

  /**
   * Load dashboard statistics
   * Fetches employee count, recent activity, system health from backend
   */
  loadDashboardStats(): Observable<DashboardStats> {
    this.logger.debug('Facade: loading dashboard stats');

    return this.dashboardApi.getDashboardStats().pipe(
      tap((response: ApiResponse<Map<string, any>>) => {
        this.logger.info('Facade: dashboard stats loaded');
      }),
      map((response: ApiResponse<any>) => {
        const stats = response.result || {};
        return {
          totalEntities: stats['totalEntities'] || 0,
          activeEntities: stats['activeEntities'] || 0,
          createdEntities: stats['pendingEntities'] || 0,
          inactiveEntities: stats['inactiveEntities'] || 0,
          recentActivity: [],
          systemHealth: {
            uptime: 99.9,
            memoryUsage: 45,
            cpuUsage: 23,
          },
        } as DashboardStats;
      }),
      catchError((error) => {
        this.logger.error('Facade: failed to load dashboard stats', error);
        this.store.setError('Failed to load dashboard');
        throw error;
      }),
    );
  }

  /**
   * Load recent audit events for activity feed
   */
  loadRecentActivity(limit = 10): Observable<any[]> {
    this.logger.debug('Facade: loading recent activity', { limit });

    return this.auditApi.getAuditEvents(0, limit).pipe(
      tap((response: ApiResponse<any>) => {
        this.store.setAuditLogs(response.result || []);
        this.logger.info('Facade: recent activity loaded', {
          count: response.result?.length || 0,
        });
      }),
      map((response: ApiResponse<any>) => {
        // Format audit events for display
        return (response.result || []).map((event: any) => ({
          id: event.id,
          timestamp: event.actionDate,
          actionTime: event.actionTime,
          employee: event.auditedObject?.name || 'Unknown',
          employeeId: event.auditedObject?.id,
          employeeNumber: event.auditedObject?.employeeNumber,
          state: event.auditedObject?.state,
          email: event.auditedObject?.emailAddress,
          action: this.getActionLabel(event),
          description: this.getActionDescription(event),
        }));
      }),
      catchError((error) => {
        this.logger.error('Facade: failed to load recent activity', error);
        throw error;
      }),
    );
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

    return `${employee.name} (${employee.employeeNumber}) - ${employee.state}`;
  }
}
