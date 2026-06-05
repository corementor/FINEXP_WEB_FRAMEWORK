import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

/**
 * HTTP Interceptor for JWT Token and Error Handling
 * - Adds JWT token to outgoing requests
 * - Handles 401/403 errors
 * - Logs HTTP errors
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get JWT token from auth service
    const token = this.authService.getToken();

    // Add Authorization header if token exists
    if (token && !req.headers.has('Authorization')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - clear auth and redirect to login
          this.logger.warn('401 Unauthorized - Clearing auth state');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden - user doesn't have permission
          this.logger.warn('403 Forbidden - Access denied');
          this.router.navigate(['/unauthorized']);
        } else if (error.status === 0) {
          // Network error
          this.logger.error('Network error', error);
        } else {
          // Other HTTP errors
          this.logger.error(`HTTP Error ${error.status}`, error);
        }
        return throwError(() => error);
      })
    );
  }
}

/**
 * Provider for API Interceptor
 */
export const API_INTERCEPTOR_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiInterceptor,
  multi: true,
};

