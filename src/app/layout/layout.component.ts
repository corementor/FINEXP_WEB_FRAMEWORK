import { Component, inject, OnInit, HostListener, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { AuthService } from '../core/services/auth.service';
import { UserRole, Permission } from '../core/models';
import { AppBreadcrumb } from './app.breadcrumb';
import { LayoutService } from './service/layout.service';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from './app.configurator';
import { AppSidebar } from './app.sidebar';
import { AppHeader } from './app.header';
import { AppToastComponent } from '@app/shared/components/ui-base';

/**
 * Navigation item interface for sidebar menu with RBAC
 */
export interface NavItem {
  label: string;
  route: string;
  icon: string;
  permission?: Permission | null; // Optional permission check
  exact?: boolean; // For routerLinkActiveOptions
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    AppHeader,
    AppSidebar,
    RouterModule,
    AppConfigurator,
    AppBreadcrumb,
    AppToastComponent,
  ],
  template: `<div
    class="layout-wrapper h-dvh bg-primary-50 dark:bg-surface-950 relative p-2 flex overflow-hidden"
    [ngClass]="containerClass()"
  >
    <app-toast />
    <div app-sidebar></div>
    <main
      class="layout-content-wrapper flex-1 max-w-[1720px] w-full mx-auto flex flex-col transition-all duration-300 h-full bg-background rounded-3xl shadow-stroke overflow-hidden"
    >
      <header app-header class="layout-topbar !z-40"></header>
      <div app-breadcrumb class="max-h-16 py-4 pr-4 pl-6 flex items-center gap-2 border-b"></div>
      <div class="p-6 flex-1 overflow-auto scrollable-content">
        <router-outlet></router-outlet>
      </div>
    </main>
    <app-configurator />
    <div class="layout-mask"></div>
  </div> `,
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly layoutService = inject(LayoutService);
  readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // RBAC & Auth state
  readonly currentUser = computed(() => {
    const user = this.authService.currentUser$();
    return user ? user.username || user.email : '';
  });

  readonly userInitial = computed(() => {
    const name = this.currentUser();
    return name ? name.charAt(0).toUpperCase() : 'A';
  });

  readonly UserRole = UserRole;
  readonly Permission = Permission;
  private inactivityTimeout: number | null = null;

  /**
   * Sidebar navigation items with permission checks
   */
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      exact: true,
    },
    {
      label: 'Employees',
      route: '/entities',
      icon: 'employees',
      permission: Permission.PERM_VIEW_EMPLOYEE,
    },
    {
      label: 'Workflows',
      route: '/workflows',
      icon: 'workflows',
      permission: Permission.PERM_MANAGE_WORKFLOWS,
    },
    {
      label: 'Audit Trail',
      route: '/audit',
      icon: 'audit',
      permission: Permission.PERM_VIEW_AUDIT,
    },
    {
      label: 'Management',
      route: '/management',
      icon: 'management',
      permission: Permission.PERM_MANAGE_ROLES,
    },
  ];

  ngOnInit(): void {
    // Setup session timeout warning (show warning at 25 minutes)
    this.setupSessionWarning();
  }

  ngOnDestroy(): void {
    // Clear inactivity timeout
    if (this.inactivityTimeout !== null) {
      window.clearTimeout(this.inactivityTimeout);
    }
  }

  /**
   * Track user activity and reset session timeout
   * Called on mouse move, click, and key press
   */
  @HostListener('document:mousemove')
  @HostListener('document:click')
  @HostListener('document:keypress')
  onUserActivity(): void {
    // Reset session timeout on user activity
    this.authService.resetSessionTimeout();
  }

  /**
   * Setup warning before session expires (at 25 minutes)
   */
  private setupSessionWarning(): void {
    const warningTime = 25 * 60 * 1000; // 25 minutes
    this.inactivityTimeout = window.setTimeout(() => {
      const displayTimeRemainingMs = this.authService.getTimeRemainingInSession();
      if (displayTimeRemainingMs > 0) {
        this.toastService.warn(
          'Session Expiring',
          `Your session will expire in ${Math.round(displayTimeRemainingMs / 1000 / 60)} minutes`,
        );
      }
    }, warningTime);
  }

  containerClass = computed(() => {
    const layoutConfig = this.layoutService.layoutConfig();
    const layoutState = this.layoutService.layoutState();

    return {
      'layout-overlay': layoutConfig.menuMode === 'overlay',
      'layout-static': layoutConfig.menuMode === 'static',
      'layout-slim': layoutConfig.menuMode === 'slim',
      'layout-horizontal': layoutConfig.menuMode === 'horizontal',
      'layout-compact': layoutConfig.menuMode === 'compact',
      'layout-reveal': layoutConfig.menuMode === 'reveal',
      'layout-drawer': layoutConfig.menuMode === 'drawer',
      'layout-overlay-active': layoutState.overlayMenuActive,
      'layout-mobile-active': layoutState.mobileMenuActive,
      'layout-static-inactive': layoutState.staticMenuInactive,
      'layout-sidebar-expanded': layoutState.sidebarExpanded,
      'layout-sidebar-anchored': layoutState.anchored,
      [`layout-sidebar-${layoutConfig.darkTheme ? 'dark' : 'light'}`]: true,
    };
  });

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
