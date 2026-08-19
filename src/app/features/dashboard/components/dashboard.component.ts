import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import {
  CardComponent,
  ButtonComponent,
  SpinnerComponent,
  TableComponent,
} from '@app/shared/components';
import { DashboardFacadeService } from '@app/features/dashboard/services';
import { LoggerService } from '@app/core/services';
import { DashboardActivity, DashboardStats, SystemHealth } from '@app/core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly dashboardFacade = inject(DashboardFacadeService);
  private readonly logger = inject(LoggerService);
  private readonly queryClient = inject(QueryClient);
  private readonly destroy$ = new Subject<void>();

  private readonly dashboardQueryKey = ['dashboard', 'stats'];
  private readonly activityQueryKey = ['dashboard', 'activity'];

  readonly dashboardQuery = injectQuery(() => ({
    queryKey: this.dashboardQueryKey,
    queryFn: () => firstValueFrom(this.dashboardFacade.loadDashboardStats()),
  }));

  readonly activityQuery = injectQuery(() => ({
    queryKey: this.activityQueryKey,
    queryFn: () => firstValueFrom(this.dashboardFacade.loadRecentActivity(10)),
  }));

  get stats(): DashboardStats | null {
    return this.dashboardQuery.data() || null;
  }

  get recentActivity(): DashboardActivity[] {
    return this.activityQuery.data() || this.stats?.recentActivity || [];
  }

  get systemHealth(): SystemHealth | null {
    return this.stats?.systemHealth || null;
  }

  get entityStates(): { state: string; count: number }[] {
    const distribution = this.stats?.entitiesByState || {};
    return Object.keys(distribution).map((state) => ({ state, count: distribution[state] }));
  }

  get isLoading(): boolean {
    return this.dashboardQuery.isPending() || this.activityQuery.isPending();
  }

  get error(): string | null {
    const statsError = this.dashboardQuery.error();
    const activityError = this.activityQuery.error();
    if (statsError) return 'Failed to load dashboard data';
    if (activityError) return 'Failed to load recent activity';
    return null;
  }

  ngOnInit(): void {
    // Queries will auto-fetch via signals with caching
  }

  onRefresh(): void {
    this.queryClient.invalidateQueries({ queryKey: this.dashboardQueryKey });
    this.queryClient.invalidateQueries({ queryKey: this.activityQueryKey });
  }

  /**
   * Format the backend uptime (milliseconds) as a readable duration
   */
  formatUptime(uptimeMillis: number): string {
    if (!uptimeMillis || uptimeMillis < 0) return '0m';

    const totalMinutes = Math.floor(uptimeMillis / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  /**
   * Get CSS classes for the system health status badge
   */
  getHealthStatusClass(status: string | undefined): string {
    switch (status) {
      case 'UP':
        return 'bg-green-100 text-green-800';
      case 'DEGRADED':
        return 'bg-yellow-100 text-yellow-800';
      case 'DOWN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get CSS classes for state badge
   */
  getStateBadgeClass(state: string): string {
    switch (state) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'CREATED':
        return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
