import { Component, inject, OnInit, HostListener, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../core/services/auth.service';
import { HasRoleDirective, HasPermissionDirective } from '../core/directives';
import { UserRole, Permission } from '../core/models';

/**
 * Navigation item interface for sidebar menu
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
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    // HasRoleDirective,
    HasPermissionDirective,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = computed(() => {
    const user = this.authService.currentUser$();
    return user ? (user.username || user.email) : '';
  });
  userInitial = computed(() => {
    const name = this.currentUser();
    return name ? name.charAt(0).toUpperCase() : 'A';
  });
  UserRole = UserRole;
  Permission = Permission;
  private inactivityTimeout: number | null = null;

  /**
   * Sidebar navigation items
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
        this.toastService.warning(
          `Your session will expire in ${Math.round(displayTimeRemainingMs / 1000 / 60)} minutes`,
        );
      }
    }, warningTime);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
