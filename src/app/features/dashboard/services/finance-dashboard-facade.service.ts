import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoggerService, FinanceDashboardApiService } from '@app/core/services';
import { ApiResponse, FinanceDashboardSummary } from '@app/core/models';

/**
 * Finance Dashboard Facade Service
 * Orchestrates the retrieval of the finance dashboard payload and keeps the
 * screen renderable when the backend is not reachable
 */
@Injectable({
  providedIn: 'root',
})
export class FinanceDashboardFacadeService {
  private readonly financeDashboardApi = inject(FinanceDashboardApiService);
  private readonly logger = inject(LoggerService);

  /**
   * Load the whole finance dashboard payload
   * Falls back to an empty summary so the widgets render empty states
   * instead of crashing when the call fails
   */
  loadSummary(period = 'MONTH'): Observable<FinanceDashboardSummary> {
    this.logger.debug('Facade: loading finance dashboard summary', { period });

    return this.financeDashboardApi.getSummary(period).pipe(
      map(
        (response: ApiResponse<FinanceDashboardSummary>) => response.result ?? this.emptySummary(),
      ),
      tap(() => this.logger.info('Facade: finance dashboard summary loaded')),
      catchError((error) => {
        this.logger.error('Facade: failed to load finance dashboard summary', error);
        return of(this.emptySummary());
      }),
    );
  }

  /**
   * Build a zeroed summary used as fallback
   */
  emptySummary(): FinanceDashboardSummary {
    return {
      cashPosition: {
        label: 'Total Cash Position',
        totalCash: 0,
        changePercent: 0,
        increase: true,
        comparedToLastMonth: 0,
        currency: 'USD',
      },
      kpis: [],
      overview: {
        selectedPeriod: 'MONTH',
        periods: [],
        legend: [],
      },
      budgetExecution: [],
      cashBreakdown: {
        slices: [],
        total: 0,
        netCashFlow: 0,
      },
      recentEntries: [],
      pendingApprovals: {
        pendingCount: 0,
        pendingAmount: 0,
        nextRunDate: '',
        approvedThisMonth: 0,
        rejectedThisMonth: 0,
      },
      currency: 'USD',
      generatedAt: 0,
    };
  }
}
