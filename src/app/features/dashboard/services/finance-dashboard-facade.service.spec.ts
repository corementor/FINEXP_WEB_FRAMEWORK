import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ApiConfigService, FinanceDashboardApiService, LoggerService } from '@app/core/services';
import { FinanceDashboardFacadeService } from './finance-dashboard-facade.service';

describe('FinanceDashboardFacadeService', () => {
  let service: FinanceDashboardFacadeService;
  let httpMock: HttpTestingController;
  let config: ApiConfigService;

  const summaryPayload = {
    cashPosition: {
      label: 'Total Cash Position',
      totalCash: 4286540.75,
      changePercent: 8.4,
      increase: true,
      comparedToLastMonth: 332180.5,
      currency: 'USD',
    },
    kpis: [
      {
        key: 'REVENUE',
        label: 'Revenue',
        value: 1845200,
        changePercent: 12.6,
        increase: true,
        comparedToLastMonth: 206400,
      },
    ],
    overview: {
      selectedPeriod: 'MONTH',
      periods: [
        {
          key: 'MONTH',
          label: 'Monthly',
          labels: ['Jan'],
          revenue: [1320000],
          expenses: [982000],
          budget: [1000000],
        },
      ],
      legend: [{ title: 'Revenue', value: 1845200, color: '#22c55e' }],
    },
    budgetExecution: [
      {
        code: 'CC-100',
        costCenter: 'Operations',
        allocated: 850000,
        consumed: 664300,
        committed: 72500,
        utilizationPercent: 78.15,
      },
    ],
    cashBreakdown: {
      slices: [{ title: 'Cash In', value: 1845200, color: '#22c55e' }],
      total: 1845200,
      netCashFlow: 418930,
    },
    recentEntries: [
      {
        reference: 'JE-2024-0412',
        description: 'Customer invoice settlement',
        counterparty: 'Alpha Industries Ltd',
        amount: 128400,
        direction: 'CREDIT',
        status: 'POSTED',
        date: '12-Nov-2024',
      },
    ],
    pendingApprovals: {
      pendingCount: 14,
      pendingAmount: 486320,
      nextRunDate: '15-Nov-2024',
      approvedThisMonth: 126,
      rejectedThisMonth: 5,
    },
    currency: 'USD',
    generatedAt: 1700000000000,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FinanceDashboardFacadeService,
        FinanceDashboardApiService,
        ApiConfigService,
        LoggerService,
      ],
    });

    service = TestBed.inject(FinanceDashboardFacadeService);
    httpMock = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ApiConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should unwrap the backend summary', async () => {
    const summary$ = new Promise<any>((resolve) => service.loadSummary().subscribe(resolve));

    const request = httpMock.expectOne(
      (req) => req.url === `${config.financeDashboardEndpoint}/summary`,
    );
    expect(request.request.params.get('period')).toBe('MONTH');
    request.flush({ result: summaryPayload, messages: [], messageCodes: [] });

    const summary = await summary$;
    expect(summary.cashPosition.totalCash).toBe(4286540.75);
    expect(summary.kpis.length).toBe(1);
    expect(summary.overview.periods[0].labels.length).toBe(1);
    expect(summary.budgetExecution[0].costCenter).toBe('Operations');
    expect(summary.recentEntries[0].status).toBe('POSTED');
    expect(summary.pendingApprovals.pendingCount).toBe(14);
  });

  it('should forward the requested period', async () => {
    const summary$ = new Promise<any>((resolve) => service.loadSummary('WEEK').subscribe(resolve));

    const request = httpMock.expectOne(
      (req) => req.url === `${config.financeDashboardEndpoint}/summary`,
    );
    expect(request.request.params.get('period')).toBe('WEEK');
    request.flush({ result: summaryPayload, messages: [], messageCodes: [] });

    await summary$;
  });

  it('should fall back to an empty summary when the call fails', async () => {
    const summary$ = new Promise<any>((resolve) => service.loadSummary().subscribe(resolve));

    httpMock
      .expectOne((req) => req.url === `${config.financeDashboardEndpoint}/summary`)
      .flush('failure', { status: 500, statusText: 'Server Error' });

    const summary = await summary$;
    expect(summary.cashPosition.totalCash).toBe(0);
    expect(summary.kpis).toEqual([]);
    expect(summary.budgetExecution).toEqual([]);
    expect(summary.recentEntries).toEqual([]);
  });
});
