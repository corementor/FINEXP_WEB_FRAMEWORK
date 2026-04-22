import { Injectable, inject, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timer, BehaviorSubject } from 'rxjs';
import { catchError, retry, timeout, finalize, switchMap, filter, take } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { AuthService } from '../services/auth.service';
import { AppError, NetworkError, TimeoutError } from '../models/error.models';
import { Router } from '@angular/router';

/**
 * Error-handling HTTP Interceptor
 * - Logs all errors
 * - Retries failed requests (except 4xx errors)
 * - Maps HTTP errors to custom error types
 * - Applies request timeout
 * - Handles 401 errors with token refresh
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly injector = inject(Injector);
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);
  private authService?: AuthService;

  private get auth(): AuthService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  private readonly retryConfig = {
    count: 2,
    delay: 1000 // milliseconds
  };

  // Subject to prevent multiple token refresh requests
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      timeout(30000), // 30 second timeout
      retry({
        count: this.retryConfig.count,
        delay: (error) => {
          // Only retry on 5xx errors or network errors, not 4xx
          if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
            return throwError(() => error);
          }
          return timer(this.retryConfig.delay);
        }
      }),
      catchError((error) => {
        // Handle 401 Unauthorized with token refresh
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Handle 401 Unauthorized error with token refresh attempt
   */
  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addAuthHeader(req, token.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.auth.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      // Wait for token refresh to complete, then retry
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addAuthHeader(req, token.accessToken));
        })
      );
    }
  }

  private addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleError(error: any): Observable<never> {
    let appError: AppError;

    if (error.name === 'TimeoutError') {
      appError = new TimeoutError(
        `Request timeout after ${error.timeout}ms`,
        error
      );
      this.logger.error('Request timeout', appError);
    } else if (error instanceof HttpErrorResponse) {
      appError = new AppError(
        this.getErrorMessage(error),
        'HTTP_ERROR',
        error.status
      );
      this.logger.error(`HTTP ${error.status}`, appError);
    } else if (error instanceof TypeError) {
      appError = new NetworkError(
        'Network error - check your connection',
        error
      );
      this.logger.error('Network error', appError);
    } else {
      appError = new AppError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR',
        500,
        error
      );
      this.logger.error('Unexpected error', appError);
    }

    return throwError(() => appError);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    // Try to get error message from response body
    if (error.error?.message) {
      return error.error.message;
    }

    // Fallback to status text
    switch (error.status) {
      case 0:
        return 'Network error - unable to reach server';
      case 400:
        return 'Bad request - invalid data';
      case 401:
        return 'Unauthorized - please login';
      case 403:
        return 'Forbidden - you don\'t have permission';
      case 404:
        return 'Not found - resource does not exist';
      case 409:
        return 'Conflict - resource already exists';
      case 500:
        return 'Server error - please try again later';
      case 503:
        return 'Service unavailable - server is down';
      default:
        return error.statusText || 'An error occurred';
    }
  }
}
