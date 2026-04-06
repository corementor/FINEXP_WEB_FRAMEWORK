import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

/**
 * Auth Token Injection Interceptor
 * - Adds authorization header to all requests
 * - Skips token injection for auth endpoints
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthService);
  private readonly logger = inject(LoggerService);

  // Endpoints that should not include auth token
  private readonly skipAuthEndpoints = [
    '/login',
    '/register',
    '/refresh-token'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth token for certain endpoints
    if (this.shouldSkipAuth(req.url)) {
      return next.handle(req);
    }

    // Add authorization header
    const token = this.auth.getToken();
    if (token) {
      req = this.addAuthHeader(req, token);
      this.logger.debug('Auth token injected', { url: req.url });
    } else {
      this.logger.warn('No auth token available', { url: req.url });
    }

    return next.handle(req);
  }

  private addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private shouldSkipAuth(url: string): boolean {
    return this.skipAuthEndpoints.some(endpoint => url.includes(endpoint));
  }
}
