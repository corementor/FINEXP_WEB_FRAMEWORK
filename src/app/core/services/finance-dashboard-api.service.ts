import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { FinanceDashboardSummary } from '../models/domain.models';
import { ApiConfigService } from './api-config.service';
import { LoggerService } from './logger.service';

/**
 * Finance Dashboard API Service - Communication layer with backend
 * Handles the HTTP call feeding the finance dashboard widgets
 */
@Injectable({
  providedIn: 'root',
})
export class FinanceDashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);
  private readonly logger = inject(LoggerService);

  /**
   * Get the whole finance dashboard payload in a single call
   */
  getSummary(period = 'MONTH'): Observable<ApiResponse<FinanceDashboardSummary>> {
    this.logger.debug('Fetching finance dashboard summary', { period });
    return this.http.get<ApiResponse<FinanceDashboardSummary>>(
      `${this.config.financeDashboardEndpoint}/summary`,
      { params: { period } },
    );
  }
}
