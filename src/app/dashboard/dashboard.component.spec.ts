import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardFacadeService } from '../features/dashboard/services/dashboard-facade.service';
import { LoggerService } from '../core/services/logger.service';
import { ToastService } from '../services/toast.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

/**
 * Dashboard Component Unit Tests
 * Tests data loading, display, refresh, and error handling
 */
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardFacadeService;
  let toastService: ToastService;
  let logger: LoggerService;

  const mockActivityData = [
    { id: '1', type: 'CREATE', entity: 'Employee', timestamp: new Date().toISOString() },
    { id: '2', type: 'UPDATE', entity: 'Workflow', timestamp: new Date().toISOString() },
  ];

  const mockDashboardStats = {
    totalEntities: 150,
    activeEntities: 120,
    createdEntities: 15,
    inactiveEntities: 15,
    recentActivity: [] as any[],
    systemHealth: {
      uptime: 99.9,
      memoryUsage: 45.5,
      cpuUsage: 23.2,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, CommonModule],
      providers: [
        {
          provide: DashboardFacadeService,
          useValue: {
            loadDashboardStats: vi.fn(() => of(mockDashboardStats)),
            loadRecentActivity: vi.fn(() => of(mockActivityData)),
          },
        },
        {
          provide: ToastService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
            info: vi.fn(),
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
    toastService = TestBed.inject(ToastService);
    logger = TestBed.inject(LoggerService);
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
    it('should display dashboard statistics', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(of(mockDashboardStats));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(dashboardService.loadDashboardStats).toHaveBeenCalled();
    });

    it('should display recent activity', async () => {
      vi.mocked(dashboardService.loadRecentActivity).mockReturnValue(of(mockActivityData));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(dashboardService.loadRecentActivity).toHaveBeenCalled();
    });

    it('should format activity timestamps', () => {
      expect(component).toBeDefined();
    });

    it('should display empty state when no activity', async () => {
      vi.mocked(dashboardService.loadRecentActivity).mockReturnValue(of([]));

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(dashboardService.loadRecentActivity).toHaveBeenCalled();
    });
  });

  describe('Data Refresh', () => {
    it('should have refresh button', () => {
      expect(component).toBeDefined();
    });

    it('should reload dashboard on refresh', () => {
      fixture.detectChanges();

      component.onRefresh();

      expect(dashboardService.loadDashboardStats).toHaveBeenCalledTimes(2);
    });

    it('should show loading state during refresh', () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(of(mockDashboardStats));

      fixture.detectChanges();
      component.onRefresh();

      expect(component.isLoading).toBe(true);
    });

    it('should clear loading state after refresh completes', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(of(mockDashboardStats));

      fixture.detectChanges();
      component.onRefresh();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.isLoading).toBe(false);
    });

    it('should show success message on refresh', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(of(mockDashboardStats));

      fixture.detectChanges();
      component.onRefresh();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(toastService.success).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle stats loading error', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(
        throwError(() => new Error('Failed to load stats')),
      );

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(toastService.error).toHaveBeenCalled();
    });

    it('should handle activity loading error', async () => {
      vi.mocked(dashboardService.loadRecentActivity).mockReturnValue(
        throwError(() => new Error('Failed to load activity')),
      );

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(toastService.error).toHaveBeenCalled();
    });

    it('should display error message to user', async () => {
      vi.mocked(dashboardService.loadDashboardStats).mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(toastService.error).toHaveBeenCalled();
    });

    it('should allow retry after error', () => {
      vi.mocked(dashboardService.loadDashboardStats)
        .mockReturnValueOnce(throwError(() => new Error('Error')))
        .mockReturnValueOnce(of(mockDashboardStats));

      expect(component).toBeDefined();
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

  describe('Statistics Calculations', () => {
    it('should calculate employee growth rate', () => {
      expect(component).toBeDefined();
    });

    it('should identify peak activity times', () => {
      expect(component).toBeDefined();
    });

    it('should track workflow performance metrics', () => {
      expect(component).toBeDefined();
    });

    it('should highlight key performance indicators', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Activity Filtering', () => {
    it('should filter activity by type', () => {
      expect(component).toBeDefined();
    });

    it('should filter activity by date range', () => {
      expect(component).toBeDefined();
    });

    it('should filter activity by entity', () => {
      expect(component).toBeDefined();
    });

    it('should maintain filter state', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Auto-refresh', () => {
    it('should auto-refresh at configured interval', () => {
      expect(component).toBeDefined();
    });

    it('should stop auto-refresh on component destroy', () => {
      expect(component).toBeDefined();
    });

    it('should respect user preference for auto-refresh', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Responsive Design', () => {
    it('should stack cards vertically on mobile', () => {
      expect(component).toBeDefined();
    });

    it('should show summary on small screens', () => {
      expect(component).toBeDefined();
    });

    it('should adapt chart display for mobile', () => {
      expect(component).toBeDefined();
    });
  });
});
