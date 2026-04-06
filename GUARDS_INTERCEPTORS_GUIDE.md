# Implementation Guide: Guards & Interceptors

## 1. Authentication Guard

```typescript
// core/guards/auth.guard.ts

import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Guard to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  toastService.warning('Please log in to continue');
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};

/**
 * Guard to prevent authenticated users from accessing auth pages
 */
export const NotAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirect to dashboard if already authenticated
  router.navigate(['/dashboard']);
  return false;
};
```

## 2. Role-Based Access Guard

```typescript
// core/guards/role-based.guard.ts

import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { UserRole } from '../models/domain.models';

/**
 * Guard for role-based access control
 * Usage: canActivate: [RoleGuard([UserRole.ADMIN, UserRole.MANAGER])]
 */
export const RoleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (allowedRoles.some((role) => user.roles.includes(role))) {
      return true;
    }

    toastService.error('You do not have permission to access this page');
    router.navigate(['/unauthorized']);
    return false;
  };
};

/**
 * Guard for permission-based access control
 * Usage: canActivate: [PermissionGuard(['MANAGE_EMPLOYEES'])]
 */
export const PermissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );

    if (hasPermission) {
      return true;
    }

    toastService.error('You do not have the required permissions');
    router.navigate(['/unauthorized']);
    return false;
  };
};

/**
 * Unsaved changes guard
 * Warns user before leaving a form with unsaved changes
 */
export const UnsavedChangesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const component = route.component as any;

  if (component && component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you want to leave?');
  }

  return true;
};
```

## 3. HTTP Error Interceptor

```typescript
// core/interceptors/http-error.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ServerError,
  ValidationError,
  NotFoundError,
} from '../models/error.models';

/**
 * HTTP Error Interceptor
 * Handles all HTTP errors and provides appropriate user feedback
 */
export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  return next(req).pipe(
    // Retry on specific errors (network errors, 5xx)
    retry({
      count: 2,
      delay: (error, retryCount) => {
        if (
          retryCount <= 2 &&
          (error.status === 0 ||
            (error.status >= 500 && error.status !== 501) ||
            error.status === 408)
        ) {
          logger.warn(`Retrying request (attempt ${retryCount})`, error);
          return throwError(() => error);
        }
        return throwError(() => error);
      },
    }),

    catchError((error: HttpErrorResponse) => {
      logger.error('HTTP Error:', error);

      let appError: AppError;

      switch (error.status) {
        case 400:
          // Validation error
          appError = new ValidationError(
            error.error.fieldErrors || {},
            error.error.message || 'Validation failed',
          );
          logger.warn('Validation error:', appError.fieldErrors);
          break;

        case 401:
          // Unauthorized
          appError = new AuthenticationError(
            error.error?.message || 'Your session has expired. Please log in again.',
          );
          authService.logout();
          router.navigate(['/auth/login']);
          toastService.error(appError.message);
          break;

        case 403:
          // Forbidden
          appError = new AuthorizationError(
            error.error?.message || 'You do not have permission to perform this action',
          );
          toastService.error(appError.message);
          break;

        case 404:
          // Not Found
          appError = new NotFoundError(error.error?.resource || 'Resource');
          logger.warn('Resource not found:', error.url);
          break;

        case 409:
          // Conflict (e.g., version mismatch)
          appError = new AppError(
            error.error?.message || 'The resource has been modified. Please refresh and try again.',
            'CONFLICT',
            409,
          );
          toastService.warning(appError.message);
          break;

        case 429:
          // Too Many Requests (Rate Limit)
          appError = new AppError(
            error.error?.message || 'Too many requests. Please try again later.',
            'RATE_LIMITED',
            429,
          );
          toastService.warning(appError.message);
          break;

        case 500:
          // Internal Server Error
          appError = new ServerError(
            error.error?.message || 'An unexpected error occurred. Please try again.',
          );
          logger.error('Server error:', error.error);
          toastService.error('Server error. Our team has been notified.');
          break;

        case 503:
          // Service Unavailable
          appError = new ServerError(
            'The service is temporarily unavailable. Please try again later.',
          );
          toastService.error(appError.message);
          break;

        default:
          // Network error or unknown error
          if (error.status === 0) {
            appError = new AppError(
              'Network error. Please check your connection.',
              'NETWORK_ERROR',
              0,
            );
            toastService.error(appError.message);
          } else {
            appError = new AppError(
              error.error?.message || 'An error occurred',
              'UNKNOWN_ERROR',
              error.status,
            );
            toastService.error('An error occurred. Please try again.');
          }
      }

      return throwError(() => appError);
    }),
  );
};
```

## 4. HTTP Auth Interceptor

```typescript
// core/interceptors/http-auth.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Auth Interceptor
 * Adds authentication token to all outgoing requests
 */
export const HttpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Get the auth token from the service
  const authToken = authService.getToken();

  // Clone the request and add the authorization header if token exists
  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Add request ID for tracing
  const requestId = this.generateRequestId();
  req = req.clone({
    setHeaders: {
      'X-Request-ID': requestId,
    },
  });

  return next(req);
};

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

## 5. HTTP Loading Interceptor

```typescript
// core/interceptors/http-loader.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

/**
 * HTTP Loader Interceptor
 * Shows/hides loading indicator during HTTP requests
 */
export const HttpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Skip loader for specific endpoints
  if (this.shouldSkipLoader(req.url)) {
    return next(req);
  }

  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      // Use setTimeout to avoid race conditions
      setTimeout(() => loaderService.hide(), 300);
    }),
  );
};

function shouldSkipLoader(url: string): boolean {
  const skipUrls = ['/health', '/version'];
  return skipUrls.some((skipUrl) => url.includes(skipUrl));
}
```

## 6. HTTP Request Timeout Interceptor

```typescript
// core/interceptors/http-timeout.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';

/**
 * HTTP Timeout Interceptor
 * Adds timeout to all HTTP requests
 */
export const HttpTimeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService);
  const timeoutDuration = configService.getHttpTimeout(); // In milliseconds

  return next(req).pipe(timeout(timeoutDuration));
};
```

## 7. HTTP Caching Interceptor (Optional)

```typescript
// core/interceptors/http-cache.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * HTTP Caching Interceptor
 * Caches GET requests to reduce API calls
 */
export const HttpCachingInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Skip caching for specific endpoints
  if (this.shouldSkipCache(req.url)) {
    return next(req);
  }

  const cachingService = inject(CachingService);
  const cachedResponse = cachingService.get(req.url);

  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cachingService.set(req.url, event);
      }
    }),
  );
};

function shouldSkipCache(url: string): boolean {
  const noCacheUrls = ['/user/current', '/settings'];
  return noCacheUrls.some((noCache) => url.includes(noCache));
}
```

## 8. Usage in App Configuration

```typescript
// app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { HttpAuthInterceptor } from './core/interceptors/http-auth.interceptor';
import { HttpLoaderInterceptor } from './core/interceptors/http-loader.interceptor';
import { HttpTimeoutInterceptor } from './core/interceptors/http-timeout.interceptor';
import { HttpCachingInterceptor } from './core/interceptors/http-cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        HttpCachingInterceptor, // Run cache check first
        HttpAuthInterceptor, // Add auth before request
        HttpLoaderInterceptor, // Show loading
        HttpTimeoutInterceptor, // Set timeout
        HttpErrorInterceptor, // Handle errors last
      ]),
    ),
  ],
};
```

## 9. Usage Examples

### Using Guards in Routes

```typescript
// app.routes.ts

import { Routes } from '@angular/router';
import { AuthGuard, NotAuthGuard } from './core/guards/auth.guard';
import { RoleGuard, PermissionGuard } from './core/guards/role-based.guard';
import { UnsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { UserRole } from './core/models/domain.models';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [NotAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        data: { title: 'Dashboard' },
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/pages/employees-list.component').then(
            (m) => m.EmployeesListComponent,
          ),
        canActivate: [PermissionGuard(['MANAGE_EMPLOYEES'])],
        data: { title: 'Employees', permissions: ['MANAGE_EMPLOYEES'] },
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/admin/admin.component').then((m) => m.AdminComponent),
        canActivate: [RoleGuard([UserRole.ADMIN])],
        data: { title: 'Admin Dashboard' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
        canDeactivate: [UnsavedChangesGuard],
        data: { title: 'Settings' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
```

### Handling Auth Errors in Component

```typescript
// features/auth/login/login.component.ts

onSubmit(): void {
  const { email, password } = this.form.value;

  this.authService.login(email, password)
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: AppError) => {
        if (error instanceof AuthenticationError) {
          this.errorMessage.set('Invalid email or password');
        } else if (error instanceof ValidationError) {
          Object.entries(error.fieldErrors).forEach(([field, messages]) => {
            this.form.get(field)?.setErrors({ custom: messages.join(', ') });
          });
        } else {
          this.errorMessage.set(error.message || 'Login failed');
        }
      }
    });
}
```

## Benefits

✅ **Centralized Error Handling**: All HTTP errors handled in one place  
✅ **Type-Safe Guards**: Compile-time checking of guard logic  
✅ **Automatic Retries**: Network errors automatically retried  
✅ **Authentication Management**: Token automatically included in requests  
✅ **Loading States**: Loading indicator shown during requests  
✅ **Rate Limiting**: Handles rate limit errors gracefully  
✅ **Session Management**: Automatic logout on 401 errors  
✅ **Request Tracing**: Request IDs for debugging
