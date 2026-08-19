import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoggerService, DashboardApiService } from '@app/core/services';
import { AppStateStore } from '@app/core/state';
import {
  ApiResponse,
  AuditLog,
  DashboardActivity,
  DashboardStats,
  DashboardSummary,
  SystemHealth,
} from '@app/core/models';

/**
 * Dashboard Facade Service
 * Orchestrates dashboard statistics and activity retrieval
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardFacadeService {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly logger = inject(LoggerService);
  private readonly store = inject(AppStateStore);

  /**
   * Load dashboard statistics
   * Uses the aggregated summary endpoint so counters, recent activity and
   * system health are fetched in a single backend call
   */
  loadDashboardStats(activityLimit = 10): Observable<DashboardStats> {
    this.logger.debug('Facade: loading dashboard stats', { activityLimit });

    return this.dashboardApi.getDashboardSummary(activityLimit).pipe(
      tap(() => this.logger.info('Facade: dashboard stats loaded')),
      map((response: ApiResponse<DashboardSummary>) => this.toDashboardStats(response.result)),
      catchError((error) => {
        this.logger.error('Facade: failed to load dashboard stats', error);
        this.store.setError('Failed to load dashboard');
        throw error;
      }),
    );
  }

  /**
   * Load recent activity entries for the activity feed
   */
  loadRecentActivity(limit = 10): Observable<DashboardActivity[]> {
    this.logger.debug('Facade: loading recent activity', { limit });

    return this.dashboardApi.getRecentActivity(limit).pipe(
      map((response: ApiResponse<DashboardActivity[]>) => response.result || []),
      tap((activities: DashboardActivity[]) => {
        this.store.setAuditLogs(activities as unknown as AuditLog[]);
        this.logger.info('Facade: recent activity loaded', { count: activities.length });
      }),
      catchError((error) => {
        this.logger.error('Facade: failed to load recent activity', error);
        throw error;
      }),
    );
  }

  /**
   * Load the runtime health indicators of the backend
   */
  loadSystemHealth(): Observable<SystemHealth> {
    this.logger.debug('Facade: loading system health');

    return this.dashboardApi.getSystemHealth().pipe(
      map((response: ApiResponse<SystemHealth>) => response.result || this.emptySystemHealth()),
      catchError((error) => {
        this.logger.error('Facade: failed to load system health', error);
        throw error;
      }),
    );
  }

  /**
   * Map the backend summary payload to the view model consumed by the UI
   */
  private toDashboardStats(summary: DashboardSummary | null | undefined): DashboardStats {
    const counters = summary?.stats;

    return {
      totalEntities: counters?.totalEntities ?? 0,
      activeEntities: counters?.activeEntities ?? 0,
      createdEntities: counters?.pendingEntities ?? 0,
      inactiveEntities: counters?.inactiveEntities ?? 0,
      totalUsers: counters?.totalUsers ?? 0,
      activeUsers: counters?.activeUsers ?? 0,
      totalRoles: counters?.totalRoles ?? 0,
      totalPermissions: counters?.totalPermissions ?? 0,
      entitiesByState: summary?.entitiesByState ?? {},
      recentActivity: summary?.recentActivity ?? [],
      systemHealth: summary?.systemHealth ?? this.emptySystemHealth(),
    };
  }

  /**
   * Fallback health payload used when the backend returns nothing
   */
  private emptySystemHealth(): SystemHealth {
    return {
      status: 'DOWN',
      uptime: 0,
      uptimeMillis: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      usedMemoryMb: 0,
      maxMemoryMb: 0,
      availableProcessors: 0,
    };
  }
}
