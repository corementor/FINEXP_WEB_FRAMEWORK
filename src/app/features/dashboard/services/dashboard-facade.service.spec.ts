import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ApiConfigService, DashboardApiService, LoggerService } from '@app/core/services';
import { AppStateStore } from '@app/core/state';
import { DashboardFacadeService } from './dashboard-facade.service';

describe('DashboardFacadeService', () => {
  let service: DashboardFacadeService;
  let httpMock: HttpTestingController;
  let config: ApiConfigService;
  let store: AppStateStore;
  let logger: LoggerService;

  const summaryPayload = {
    stats: {
      totalEntities: 10,
      activeEntities: 7,
      pendingEntities: 2,
      inactiveEntities: 1,
      totalUsers: 3,
      activeUsers: 3,
      totalRoles: 3,
      totalPermissions: 18,
    },
    recentActivity: [
      {
        id: 1,
        actionTime: 1700000000000,
        actionDate: '14-Nov-2023, 22:13:20',
        action: 'Created',
        description: 'John Doe (EMP-001) - CREATED',
        entityId: 'a1',
        entityType: 'DummyEmployee',
        entityName: 'John Doe',
        entityNumber: 'EMP-001',
        email: 'john@finxp.local',
        state: 'CREATED',
        userId: 'admin',
      },
    ],
    entitiesByState: { CREATED: 2, ACTIVE: 7, INACTIVE: 1 },
    systemHealth: {
      status: 'UP',
      uptime: 100,
      uptimeMillis: 3600000,
      memoryUsage: 42.5,
      cpuUsage: 12.25,
      usedMemoryMb: 512,
      maxMemoryMb: 2048,
      availableProcessors: 8,
    },
    generatedAt: 1700000000000,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DashboardFacadeService,
        DashboardApiService,
        ApiConfigService,
        LoggerService,
        AppStateStore,
      ],
    });

    service = TestBed.inject(DashboardFacadeService);
    httpMock = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ApiConfigService);
    store = TestBed.inject(AppStateStore);
    logger = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('Service methods', () => {
    it('should have loadDashboardStats method', () => {
      expect(typeof service.loadDashboardStats).toBe('function');
    });

    it('should have loadRecentActivity method', () => {
      expect(typeof service.loadRecentActivity).toBe('function');
    });

    it('should have loadSystemHealth method', () => {
      expect(typeof service.loadSystemHealth).toBe('function');
    });
  });

  describe('Dashboard stats', () => {
    it('should map the backend summary to dashboard statistics', async () => {
      const stats$ = new Promise<any>((resolve) =>
        service.loadDashboardStats().subscribe(resolve),
      );

      const request = httpMock.expectOne(
        (req) => req.url === `${config.dashboardEndpoint}/summary`,
      );
      expect(request.request.params.get('activityLimit')).toBe('10');
      request.flush({ result: summaryPayload, messages: [], messageCodes: [] });

      const stats = await stats$;
      expect(stats.totalEntities).toBe(10);
      expect(stats.activeEntities).toBe(7);
      expect(stats.createdEntities).toBe(2);
      expect(stats.inactiveEntities).toBe(1);
      expect(stats.totalUsers).toBe(3);
      expect(stats.totalRoles).toBe(3);
      expect(stats.totalPermissions).toBe(18);
      expect(stats.entitiesByState['ACTIVE']).toBe(7);
      expect(stats.recentActivity.length).toBe(1);
    });

    it('should expose the backend system health metrics', async () => {
      const stats$ = new Promise<any>((resolve) =>
        service.loadDashboardStats().subscribe(resolve),
      );

      httpMock
        .expectOne((req) => req.url === `${config.dashboardEndpoint}/summary`)
        .flush({ result: summaryPayload, messages: [], messageCodes: [] });

      const stats = await stats$;
      expect(stats.systemHealth.status).toBe('UP');
      expect(stats.systemHealth.memoryUsage).toBe(42.5);
      expect(stats.systemHealth.cpuUsage).toBe(12.25);
    });

    it('should fall back to zeroed counters when the payload is empty', async () => {
      const stats$ = new Promise<any>((resolve) =>
        service.loadDashboardStats().subscribe(resolve),
      );

      httpMock
        .expectOne((req) => req.url === `${config.dashboardEndpoint}/summary`)
        .flush({ result: null, messages: [], messageCodes: [] });

      const stats = await stats$;
      expect(stats.totalEntities).toBe(0);
      expect(stats.recentActivity).toEqual([]);
      expect(stats.systemHealth.status).toBe('DOWN');
    });
  });

  describe('Recent activity', () => {
    it('should load recent activity with the requested limit', async () => {
      const activity$ = new Promise<any>((resolve) =>
        service.loadRecentActivity(25).subscribe(resolve),
      );

      const request = httpMock.expectOne(
        (req) => req.url === `${config.dashboardEndpoint}/activity`,
      );
      expect(request.request.params.get('limit')).toBe('25');
      request.flush({
        result: summaryPayload.recentActivity,
        messages: [],
        messageCodes: [],
      });

      const activity = await activity$;
      expect(Array.isArray(activity)).toBe(true);
      expect(activity[0].entityName).toBe('John Doe');
    });

    it('should update store with the activity feed', async () => {
      const setAuditSpy = vi.spyOn(store, 'setAuditLogs');

      const activity$ = new Promise<void>((resolve) =>
        service.loadRecentActivity().subscribe(() => resolve()),
      );

      httpMock
        .expectOne((req) => req.url === `${config.dashboardEndpoint}/activity`)
        .flush({ result: summaryPayload.recentActivity, messages: [], messageCodes: [] });

      await activity$;
      expect(setAuditSpy).toHaveBeenCalled();
    });
  });

  describe('System health', () => {
    it('should load the system health endpoint', async () => {
      const health$ = new Promise<any>((resolve) => service.loadSystemHealth().subscribe(resolve));

      httpMock
        .expectOne((req) => req.url === `${config.dashboardEndpoint}/health`)
        .flush({ result: summaryPayload.systemHealth, messages: [], messageCodes: [] });

      const health = await health$;
      expect(health.status).toBe('UP');
      expect(health.availableProcessors).toBe(8);
    });
  });

  describe('Error handling', () => {
    it('should record an error in the store when stats fail', async () => {
      const setErrorSpy = vi.spyOn(store, 'setError');

      const failure$ = new Promise<void>((resolve) =>
        service.loadDashboardStats().subscribe({ error: () => resolve() }),
      );

      httpMock
        .expectOne((req) => req.url === `${config.dashboardEndpoint}/summary`)
        .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      await failure$;
      expect(setErrorSpy).toHaveBeenCalledWith('Failed to load dashboard');
    });

    it('should have logger for error logging', () => {
      expect(typeof logger.error).toBe('function');
    });
  });
});
