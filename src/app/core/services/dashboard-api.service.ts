import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
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
   * Returns aggregated metrics including employee counts and system health
   */
  getDashboardStats(): Observable<ApiResponse<Map<string, any>>> {
    this.logger.debug('Fetching dashboard statistics');
    return this.http.get<ApiResponse<Map<string, any>>>(`${this.config.dashboardEndpoint}/stats`);
  }
}
