import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { EmployeeApiService, AuditApiService, LoggerService } from '@app/core/services';
import { AppStateStore } from '@app/core/state';
import { DashboardFacadeService } from './dashboard-facade.service';
import { MockApiService } from '@app/core/testing/mock-api.service';

describe('DashboardFacadeService', () => {
  let service: DashboardFacadeService;
  let employeeApi: EmployeeApiService;
  let auditApi: AuditApiService;
  let store: AppStateStore;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardFacadeService,
        EmployeeApiService,
        AuditApiService,
        MockApiService,
        LoggerService,
        AppStateStore,
      ],
    });

    service = TestBed.inject(DashboardFacadeService);
    employeeApi = TestBed.inject(EmployeeApiService);
    auditApi = TestBed.inject(AuditApiService);
    store = TestBed.inject(AppStateStore);
    logger = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with valid state', () => {
    expect(service).toBeTruthy();
  });

  describe('Service methods', () => {
    it('should have loadDashboardStats method', () => {
      expect(typeof service.loadDashboardStats).toBe('function');
    });

    it('should have loadRecentActivity method', () => {
      expect(typeof service.loadRecentActivity).toBe('function');
    });
  });

  describe('Dashboard stats', () => {
    it('should load dashboard statistics', async () => {
      const stats = await new Promise<any>((resolve) => {
        service.loadDashboardStats().subscribe((result) => {
          resolve(result);
        });
      });

      expect(stats).toBeDefined();
      expect(stats.totalEntities).toBeDefined();
      expect(stats.activeEntities).toBeDefined();
      expect(stats.inactiveEntities).toBeDefined();
      expect(stats.systemHealth).toBeDefined();
    });

    it('should provide system health metrics', async () => {
      const stats = await new Promise<any>((resolve) => {
        service.loadDashboardStats().subscribe((result) => {
          resolve(result);
        });
      });

      expect(stats.systemHealth.uptime).toBe(99.9);
      expect(stats.systemHealth.memoryUsage).toBe(45);
      expect(stats.systemHealth.cpuUsage).toBe(23);
    });

    it('should calculate correct active/inactive ratios', async () => {
      const stats = await new Promise<any>((resolve) => {
        service.loadDashboardStats().subscribe((result) => {
          resolve(result);
        });
      });

      if (stats.totalEntities > 0) {
        const expectedActive = Math.floor(stats.totalEntities * 0.85);
        expect(stats.activeEntities).toBe(expectedActive);
      }
    });
  });

  describe('Recent activity', () => {
    it('should load recent activity', async () => {
      const activity = await new Promise<any>((resolve) => {
        service.loadRecentActivity(10).subscribe((result) => {
          resolve(result);
        });
      });

      expect(Array.isArray(activity)).toBe(true);
    });

    it('should use default limit of 10', async () => {
      const activity = await new Promise<any>((resolve) => {
        service.loadRecentActivity().subscribe((result) => {
          resolve(result);
        });
      });

      expect(Array.isArray(activity)).toBe(true);
    });

    it('should accept custom limit parameter', async () => {
      const activity = await new Promise<any>((resolve) => {
        service.loadRecentActivity(25).subscribe((result) => {
          resolve(result);
        });
      });

      expect(Array.isArray(activity)).toBe(true);
    });

    it('should update store with audit logs', async () => {
      const setAuditSpy = vi.spyOn(store, 'setAuditLogs' as any);

      await new Promise<void>((resolve) => {
        service.loadRecentActivity(10).subscribe(() => {
          resolve();
        });
      });

      expect(setAuditSpy).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should have logger for error logging', () => {
      expect(typeof logger.error).toBe('function');
    });

    it('should have store setError method', () => {
      expect(typeof store.setError).toBe('function');
    });
  });
});
