import { Component, inject, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  currentUser = '';
  userInitial = 'A';
  private inactivityTimeout: number | null = null;

  ngOnInit(): void {
    // Get current user from auth service
    const user = this.authService.currentUser$();
    if (user) {
      this.currentUser = user.username || user.email;
      this.userInitial = this.currentUser.charAt(0).toUpperCase();
    }

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
          `Your session will expire in ${Math.round(displayTimeRemainingMs / 1000 / 60)} minutes`
        );
      }
    }, warningTime);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
