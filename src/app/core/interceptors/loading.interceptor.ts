import { Injectable, inject, effect, signal } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * Loading State Interceptor
 * Tracks ongoing HTTP requests to manage loading indicators
 * Usage: subscribe to loadingService.isLoading$ signal in components
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggerService);

  // Track number of ongoing requests
  private requestCountSignal = signal(0);

  // Public signal for UI components
  readonly isLoading = this.requestCountSignal;

  // Excluded paths from loading indicator (e.g., health checks)
  private readonly excludedPaths = [
    '/health',
    '/ping'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldTrackRequest(req.url)) {
      this.incrementLoading();
      this.logger.debug('Request started', { url: req.url });
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (this.shouldTrackRequest(req.url)) {
          this.decrementLoading();
          this.logger.debug('Request completed', { url: req.url });
        }
      })
    );
  }

  private incrementLoading(): void {
    const current = this.requestCountSignal();
    this.requestCountSignal.set(current + 1);
  }

  private decrementLoading(): void {
    const current = this.requestCountSignal();
    this.requestCountSignal.set(Math.max(0, current - 1));
  }

  private shouldTrackRequest(url: string): boolean {
    return !this.excludedPaths.some(path => url.includes(path));
  }

  /**
   * Get loading state as boolean signal
   */
  getIsLoading() {
    // Convert count > 0 to boolean
    return signal(this.requestCountSignal() > 0);
  }
}
