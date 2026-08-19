import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardFacadeService } from '@app/features/dashboard/services';
import { LoggerService } from '@app/core/services';

/**
 * Dashboard Component Unit Tests
 * Tests data loading, display, refresh, and error handling
 */
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardFacadeService;

  const mockActivityData = [
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
  ];

  const mockSystemHealth = {
    status: 'UP',
    uptime: 100,
    uptimeMillis: 3600000,
    memoryUsage: 45.5,
    cpuUsage: 23.2,
    usedMemoryMb: 512,
    maxMemoryMb: 2048,
    availableProcessors: 8,
  };

  const mockDashboardStats = {
    totalEntities: 150,
    activeEntities: 120,
    createdEntities: 15,
    inactiveEntities: 15,
    totalUsers: 3,
    activeUsers: 3,
    totalRoles: 3,
    totalPermissions: 18,
    entitiesByState: { CREATED: 15, ACTIVE: 120, INACTIVE: 15 },
    recentActivity: mockActivityData,
    systemHealth: mockSystemHealth,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, CommonModule, RouterModule.forRoot([])],
      providers: [
        provideAngularQuery(new QueryClient({ defaultOptions: { queries: { retry: false } } })),
        {
          provide: DashboardFacadeService,
          useValue: {
            loadDashboardStats: vi.fn(() => of(mockDashboardStats)),
            loadRecentActivity: vi.fn(() => of(mockActivityData)),
            loadSystemHealth: vi.fn(() => of(mockSystemHealth)),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
            error: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardFacadeService);
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should load dashboard stats on init', () => {
      fixture.detectChanges();
      expect(dashboardService.loadDashboardStats).toHaveBeenCalled();
    });

    it('should load recent activity on init', () => {
      fixture.detectChanges();
      expect(dashboardService.loadRecentActivity).toHaveBeenCalled();
    });

    it('should initialize loading state', () => {
      expect(component.isLoading).toBe(true);
    });
  });

  describe('Data Display', () => {
    it('should expose dashboard statistics once loaded', async () => {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.stats?.totalEntities).toBe(150);
      expect(component.stats?.totalPermissions).toBe(18);
    });

    it('should expose the recent activity feed', async () => {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.recentActivity.length).toBe(1);
      expect(component.recentActivity[0].entityName).toBe('John Doe');
    });

    it('should expose the system health metrics', async () => {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.systemHealth?.status).toBe('UP');
    });

    it('should expose the lifecycle distribution', async () => {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.entityStates.length).toBe(3);
      expect(component.entityStates[1]).toEqual({ state: 'ACTIVE', count: 120 });
    });

    it('should display an empty feed when there is no activity', async () => {
      vi.mocked(dashboardService.loadRecentActivity).mockReturnValue(of([]));
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(
        of({ ...mockDashboardStats, recentActivity: [] }),
      );

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.recentActivity).toEqual([]);
    });
  });

  describe('Formatting helpers', () => {
    it('should format the uptime in hours and minutes', () => {
      expect(component.formatUptime(3600000)).toBe('1h 0m');
    });

    it('should format the uptime in days when applicable', () => {
      expect(component.formatUptime(2 * 86400000 + 3600000)).toBe('2d 1h');
    });

    it('should fall back to zero minutes for an invalid uptime', () => {
      expect(component.formatUptime(0)).toBe('0m');
    });

    it('should return a badge class per health status', () => {
      expect(component.getHealthStatusClass('UP')).toContain('green');
      expect(component.getHealthStatusClass('DEGRADED')).toContain('yellow');
      expect(component.getHealthStatusClass('DOWN')).toContain('red');
    });

    it('should return a badge class per lifecycle state', () => {
      expect(component.getStateBadgeClass('ACTIVE')).toContain('green');
      expect(component.getStateBadgeClass('INACTIVE')).toContain('red');
      expect(component.getStateBadgeClass('CREATED')).toContain('blue');
    });
  });

  describe('Data Refresh', () => {
    it('should reload dashboard on refresh', async () => {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      component.onRefresh();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(vi.mocked(dashboardService.loadDashboardStats).mock.calls.length).toBeGreaterThan(1);
    });
  });

  describe('Error Handling', () => {
    it('should report an error when stats loading fails', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(
        throwError(() => new Error('Failed to load stats')),
      );

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.error).toBe('Failed to load dashboard data');
    });

    it('should report an error when activity loading fails', async () => {
      vi.mocked(dashboardService.loadRecentActivity).mockReturnValue(
        throwError(() => new Error('Failed to load activity')),
      );

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.error).toBe('Failed to load recent activity');
    });

    it('should reset loading state on error', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(
        throwError(() => new Error('Error')),
      );

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(component.isLoading).toBe(false);
    });
  });
});
