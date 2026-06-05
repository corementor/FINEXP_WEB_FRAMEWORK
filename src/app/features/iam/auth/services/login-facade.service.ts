import { Injectable, inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService, LoggerService } from '@app/core/services';
import { ValidationService } from '@app/shared/services/validation.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  redirectUrl: string;
}

/**
 * Login/Auth Facade Service
 * Orchestrates authentication flow for the login feature
 */
@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {
  private readonly auth = inject(AuthService);
  private readonly logger = inject(LoggerService);
  private readonly validator = inject(ValidationService);

  /**
   * Authenticate user with email/password and validation
   * Returns observable that completes when login is successful
   */
  loginUser(request: LoginRequest): Observable<LoginResponse> {
    this.logger.debug('Login facade: attempting login', { email: request.email });

    // Pre-login validation
    if (!request.email || !request.password) {
      const error = 'Email and password are required';
      this.logger.warn('Login facade: validation failed', { error });
      return throwError(() => new Error(error));
    }

    if (!request.email.includes('@')) {
      const error = 'Invalid email format';
      this.logger.warn('Login facade: validation failed', { error });
      return throwError(() => new Error(error));
    }

    if (request.password.length < 6) {
      const error = 'Password must be at least 6 characters';
      this.logger.warn('Login facade: validation failed', { error });
      return throwError(() => new Error(error));
    }

    return this.auth.login(request.email, request.password).pipe(
      tap(() => {
        this.logger.info('Login facade: login successful', { email: request.email });
      }),
      map(() => ({
        success: true,
        message: 'Login successful',
        redirectUrl: '/dashboard',
      })),
      catchError((error) => {
        this.logger.error('Login facade: login failed', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return this.auth.getCurrentUser();
  }
}
