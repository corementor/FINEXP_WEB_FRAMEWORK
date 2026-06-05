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
import { DashboardStats } from '@app/core/models';

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

  get recentActivity(): any[] {
    return this.activityQuery.data() || [];
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
