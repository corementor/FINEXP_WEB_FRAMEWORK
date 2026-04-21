import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthToken, Principal, UserRole, Permission } from '../models/domain.models';
import { LoggerService } from './logger.service';
import { ApiConfigService } from './api-config.service';

/**
 * Auth Service - Handles authentication
 * Currently uses MOCK authentication for frontend development
 * Will integrate with backend auth microservice when ready
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly config = inject(ApiConfigService);
  private readonly platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive state
  private isAuthenticatedSignal = signal(false);
  private currentUserSignal = signal<Principal | null>(null);
  private authTokenSignal = signal<AuthToken | null>(null);
  private sessionTimeoutSignal = signal<number | null>(null); // Session timeout timestamp
  private isSessionExpiredSignal = signal(false);

  // Public observables
  readonly isAuthenticated$ = this.isAuthenticatedSignal;
  readonly currentUser$ = this.currentUserSignal;
  readonly authToken$ = this.authTokenSignal;
  readonly isSessionExpired$ = this.isSessionExpiredSignal;

  // Computed signals
  readonly userRoles = computed(() => this.currentUserSignal()?.roles || []);
  readonly userPermissions = computed(() => this.currentUserSignal()?.permissions || []);

  // Session management settings (milliseconds)
  private readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  private readonly TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  private sessionTimeoutId: number | null = null;
  private tokenRefreshId: number | null = null;

  constructor() {
    // Load auth state from localStorage on init (browser only)
    if (this.isBrowser) {
      this.loadAuthState();
    }
  }

  /**
   * Mock Login Implementation
   * TODO: Replace with actual backend auth when security is implemented
   */
  login(email: string, password: string): Observable<AuthToken> {
    this.logger.debug('Login attempt', { email });

    // Use real backend when not in mock mode
    if (!environment.mockAuth.enabled) {
      return this.http
        .post<any>(this.config.authEndpoint, {
          email,
          password,
        })
        .pipe(
          tap((response: any) => {
            // Map response to AuthToken
            const token: AuthToken = {
              accessToken: response.access_token || response.accessToken,
              refreshToken: response.refresh_token || response.refreshToken || '',
              expiresIn: response.expires_in || 86400,
              tokenType: response.token_type || 'Bearer',
            };
            this.authTokenSignal.set(token);
            this.isAuthenticatedSignal.set(true);
            this.saveAuthState();
            this.logger.info('Login successful', { email });
            // Fetch user principal after login
            this.fetchCurrentUser();
            return token;
          }),
          catchError((error) => {
            this.logger.error('Login failed', error);
            return throwError(() => new Error(error.error?.message || 'Login failed'));
          }),
        );
    }

    // MOCK IMPLEMENTATION - For development without backend
    const mockToken: AuthToken = {
      accessToken: 'mock_token_' + Date.now(),
      refreshToken: 'mock_refresh_' + Date.now(),
      expiresIn: 8600, // 1 hour
      tokenType: 'Bearer',
    };

    const mockPrincipal: Principal = {
      id: 'mock_user_001',
      username: email.split('@')[0],
      email,
      roles: [UserRole.ADMIN],
      permissions: Object.values(Permission),
      department: 'Management',
      lastLogin: new Date().toISOString(),
    };

    // Simulate API delay
    return of(mockToken).pipe(
      delay(800),
      tap(() => {
        this.authTokenSignal.set(mockToken);
        this.currentUserSignal.set(mockPrincipal);
        this.isAuthenticatedSignal.set(true);
        this.startSessionManagement();
        this.saveAuthState();
        this.logger.info('Login successful (mock)', { email });
      }),
    );
  }

  /**
   * Logout - Clear authentication state
   */
  logout(): void {
    this.authTokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.isSessionExpiredSignal.set(false);
    this.sessionTimeoutSignal.set(null);
    this.stopSessionManagement();
    this.clearAuthState();
    this.logger.info('Logout successful');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  /**
   * Get current user
   */
  getCurrentUser(): Principal | null {
    return this.currentUserSignal();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.authTokenSignal()?.accessToken || null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.userRoles().includes(role);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission);
  }

  /**
   * Check if user has any of the provided permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    const userPerms = this.userPermissions();
    return permissions.some((p) => userPerms.includes(p));
  }

  /**
   * Check if user has all provided permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    const userPerms = this.userPermissions();
    return permissions.every((p) => userPerms.includes(p));
  }

  /**
   * Refresh token - Call this when token is about to expire
   */
  refreshToken(): Observable<AuthToken> {
    const currentToken = this.authTokenSignal();
    if (!currentToken?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // MOCK: Simulate token refresh
    if (environment.mockAuth.enabled) {
      const newToken: AuthToken = {
        ...currentToken,
        accessToken: 'mock_token_' + Date.now(),
        expiresIn: 8600,
      };

      return of(newToken).pipe(
        delay(300),
        tap((token) => {
          this.authTokenSignal.set(token);
          this.saveAuthState();
          this.logger.info('Token refreshed');
        }),
      );
    }

    // Real implementation when backend is ready
    return this.http
      .post<AuthToken>(this.config.refreshTokenEndpoint, {
        refreshToken: currentToken.refreshToken,
      })
      .pipe(
        tap((token) => {
          this.authTokenSignal.set(token);
          this.saveAuthState();
          this.logger.info('Token refreshed');
        }),
      );
  }

  /**
   * Fetch current user principal from backend
   * Called after successful login to get user details and permissions
   */
  private fetchCurrentUser(): void {
    if (environment.mockAuth.enabled) {
      // Mock: set default admin user for demo
      const mockPrincipal: Principal = {
        id: 'user_001',
        username: 'admin',
        email: 'admin@finxp.local',
        roles: [UserRole.ADMIN],
        permissions: Object.values(Permission),
        department: 'Management',
        lastLogin: new Date().toISOString(),
      };
      this.currentUserSignal.set(mockPrincipal);
      this.startSessionManagement();
      return;
    }

    // Real backend implementation
    this.http
      .get<{ result: any }>(`${this.config.baseUrl}/auth/me`)
      .pipe(
        tap((response) => {
          if (response.result) {
            const user = response.result;
            const principal: Principal = {
              id: user.guid || user.id || 'unknown',
              username: user.username,
              email: user.email,
              roles: [UserRole.USER], // Map from backend roles
              permissions: [Permission.VIEW_DASHBOARD], // Default permissions
              department: 'Finance',
              lastLogin: new Date().toISOString(),
            };
            this.currentUserSignal.set(principal);
            this.startSessionManagement();
            this.logger.info('Current user loaded', { userId: principal.id });
          }
        }),
        catchError((error) => {
          this.logger.error('Failed to fetch current user', error);
          // Continue with login even if user fetch fails
          return of(null);
        }),
      )
      .subscribe();
  }

  /**
   * Save auth state to localStorage (browser only)
   */
  private saveAuthState(): void {
    if (!this.isBrowser) return;

    const token = this.authTokenSignal();
    const user = this.currentUserSignal();

    if (token) {
      localStorage.setItem('authToken', JSON.stringify(token));
    }
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Load auth state from localStorage (browser only)
   */
  private loadAuthState(): void {
    if (!this.isBrowser) return;

    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken) {
      try {
        const token = JSON.parse(savedToken) as AuthToken;
        this.authTokenSignal.set(token);

        // Check if token is expired
        if (!this.isTokenExpired(token)) {
          this.isAuthenticatedSignal.set(true);
        } else {
          this.clearAuthState();
        }
      } catch (error) {
        this.logger.warn('Failed to parse saved token', error);
        this.clearAuthState();
      }
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as Principal;
        this.currentUserSignal.set(user);
      } catch (error) {
        this.logger.warn('Failed to parse saved user', error);
      }
    }
  }

  /**
   * Clear auth state from localStorage (browser only)
   */
  private clearAuthState(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('savedEmail');
  }

  /**
   * Check if token is expired (naive implementation)
   */
  private isTokenExpired(token: AuthToken): boolean {
    // Simple check: if token was created more than expiresIn seconds ago, it's expired
    // In real implementation, JWT decode is used
    return false; // For mock, assume not expired
  }

  /**
   * Start session management - setup timeout and token refresh
   */
  private startSessionManagement(): void {
    if (!this.isBrowser) return;

    // Clear any existing timers
    this.stopSessionManagement();

    // Set session timeout
    const sessionTimeout = Date.now() + this.SESSION_TIMEOUT_MS;
    this.sessionTimeoutSignal.set(sessionTimeout);
    if (this.isBrowser) {
      localStorage.setItem('sessionTimeout', sessionTimeout.toString());
    }

    // Setup session timeout handler (auto-logout after 30 minutes)
    this.sessionTimeoutId = window.setTimeout(() => {
      this.logger.warn('Session timeout - auto logout');
      this.isSessionExpiredSignal.set(true);
      this.logout();
    }, this.SESSION_TIMEOUT_MS);

    // Setup token refresh interval (refresh every 5 minutes)
    this.tokenRefreshId = window.setInterval(() => {
      if (this.isAuthenticatedSignal()) {
        this.logger.debug('Auto-refreshing token');
        this.refreshToken().subscribe({
          error: (err) => this.logger.warn('Token refresh failed', err),
        });
      }
    }, this.TOKEN_REFRESH_INTERVAL_MS);

    this.logger.info('Session management started', {
      timeoutMs: this.SESSION_TIMEOUT_MS,
      refreshIntervalMs: this.TOKEN_REFRESH_INTERVAL_MS,
    });
  }

  /**
   * Stop session management - clear all timers
   */
  private stopSessionManagement(): void {
    if (this.sessionTimeoutId !== null) {
      window.clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
    if (this.tokenRefreshId !== null) {
      window.clearInterval(this.tokenRefreshId);
      this.tokenRefreshId = null;
    }
    if (this.isBrowser) {
      localStorage.removeItem('sessionTimeout');
    }
    this.logger.debug('Session management stopped');
  }

  /**
   * Check if session is expired
   */
  checkSessionExpiry(): boolean {
    const sessionTimeout = this.sessionTimeoutSignal();
    if (!sessionTimeout) {
      return false;
    }

    const isExpired = Date.now() > sessionTimeout;
    if (isExpired && !this.isSessionExpiredSignal()) {
      this.logger.warn('Session expiry detected');
      this.isSessionExpiredSignal.set(true);
      this.logout();
    }
    return isExpired;
  }

  /**
   * Reset session timeout on user activity
   */
  resetSessionTimeout(): void {
    if (!this.isAuthenticatedSignal() || !this.isBrowser) return;

    // Clear current timeout
    if (this.sessionTimeoutId !== null) {
      window.clearTimeout(this.sessionTimeoutId);
    }

    // Set new timeout
    const newSessionTimeout = Date.now() + this.SESSION_TIMEOUT_MS;
    this.sessionTimeoutSignal.set(newSessionTimeout);
    localStorage.setItem('sessionTimeout', newSessionTimeout.toString());

    // Setup new timeout handler
    this.sessionTimeoutId = window.setTimeout(() => {
      this.logger.warn('Session timeout - auto logout');
      this.isSessionExpiredSignal.set(true);
      this.logout();
    }, this.SESSION_TIMEOUT_MS);

    this.logger.debug('Session timeout reset');
  }

  /**
   * Get time remaining in session (milliseconds)
   */
  getTimeRemainingInSession(): number {
    const sessionTimeout = this.sessionTimeoutSignal();
    if (!sessionTimeout) {
      return 0;
    }

    const remaining = sessionTimeout - Date.now();
    return remaining > 0 ? remaining : 0;
  }
}
