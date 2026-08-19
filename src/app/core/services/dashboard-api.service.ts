import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import {
  DashboardActivity,
  DashboardCounters,
  DashboardSummary,
  SystemHealth,
} from '../models/domain.models';
import { ApiConfigService } from './api-config.service';
import { LoggerService } from './logger.service';

/**
 * Dashboard API Service - Communication layer with backend
 * Handles all HTTP calls for dashboard statistics and metrics
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);
  private readonly logger = inject(LoggerService);

  /**
   * Get dashboard statistics
   * Returns aggregated entity, user, role and permission counters
   */
  getDashboardStats(): Observable<ApiResponse<DashboardCounters>> {
    this.logger.debug('Fetching dashboard statistics');
    return this.http.get<ApiResponse<DashboardCounters>>(`${this.config.dashboardEndpoint}/stats`);
  }

  /**
   * Get the recent activity feed built from the audit trail
   */
  getRecentActivity(limit = 10): Observable<ApiResponse<DashboardActivity[]>> {
    this.logger.debug('Fetching dashboard activity', { limit });
    return this.http.get<ApiResponse<DashboardActivity[]>>(
      `${this.config.dashboardEndpoint}/activity`,
      { params: { limit } },
    );
  }

  /**
   * Get the runtime health indicators of the backend
   */
  getSystemHealth(): Observable<ApiResponse<SystemHealth>> {
    this.logger.debug('Fetching dashboard system health');
    return this.http.get<ApiResponse<SystemHealth>>(`${this.config.dashboardEndpoint}/health`);
  }

  /**
   * Get the whole dashboard payload in a single call
   */
  getDashboardSummary(activityLimit = 10): Observable<ApiResponse<DashboardSummary>> {
    this.logger.debug('Fetching dashboard summary', { activityLimit });
    return this.http.get<ApiResponse<DashboardSummary>>(
      `${this.config.dashboardEndpoint}/summary`,
      { params: { activityLimit } },
    );
  }
}
