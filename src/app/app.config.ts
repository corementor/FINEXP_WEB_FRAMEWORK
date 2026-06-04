import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ErrorInterceptor, AuthInterceptor, LoadingInterceptor } from './core/interceptors';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

import { definePreset } from '@primeuix/themes';
const MyPreset = definePreset(Aura, {
  semantic: {
    select: {
      borderRadius: '{border.radius.lg}',
      height: '2rem',
    },
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
});
export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({ theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } } }),
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      // Register HTTP Interceptors in order
      // Order matters: Error should be last to catch all errors
    ),
    provideAngularQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // ✅ Keep data fresh for 5 minutes
            gcTime: 10 * 60 * 1000, // ✅ Keep cache for 10 minutes
            retry: 3,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    ),
    provideClientHydration(withEventReplay()),

    // HTTP Interceptor providers - legacy approach for compatibility
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
};
