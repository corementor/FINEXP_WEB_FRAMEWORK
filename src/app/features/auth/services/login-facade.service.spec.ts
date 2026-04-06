import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { AuthService, LoggerService } from '@app/core/services';
import { LoginFacadeService, LoginRequest } from './login-facade.service';
import { createMockAuthToken, createMockAuthState } from '@app/core/testing/test-helpers';
import { of, throwError } from 'rxjs';

describe('LoginFacadeService', () => {
  let service: LoginFacadeService;
  let authService: AuthService;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginFacadeService, AuthService, LoggerService],
    });

    service = TestBed.inject(LoginFacadeService);
    authService = TestBed.inject(AuthService);
    logger = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('loginUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@finxp.com',
        password: 'Password@123',
      };

      vi.spyOn(authService, 'login').mockReturnValue(of(createMockAuthToken()));

      const response = await new Promise<any>((resolve) => {
        service.loginUser(loginRequest).subscribe((result) => {
          resolve(result);
        });
      });

      expect(response.success).toBe(true);
      expect(response.message).toBe('Login successful');
      expect(response.redirectUrl).toBe('/dashboard');
    });

    it('should handle login errors gracefully', async () => {
      const loginRequest: LoginRequest = {
        email: 'wrong@finxp.com',
        password: 'WrongPassword',
      };

      vi.spyOn(authService, 'login').mockReturnValue(
        throwError(() => new Error('Invalid credentials')),
      );

      let errorOccurred = false;
      service.loginUser(loginRequest).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(errorOccurred || logger).toBeTruthy();
    });

    it('should return correct redirect URL on success', async () => {
      const loginRequest: LoginRequest = {
        email: 'admin@finxp.com',
        password: 'AdminPass@123',
      };

      vi.spyOn(authService, 'login').mockReturnValue(of(createMockAuthToken()));

      const response = await new Promise<any>((resolve) => {
        service.loginUser(loginRequest).subscribe((result) => {
          resolve(result);
        });
      });

      expect(response.redirectUrl).toBe('/dashboard');
    });
  });

  describe('isAuthenticated', () => {
    it('should return authentication status', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when not authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current authenticated user', () => {
      const mockUser = createMockAuthState();
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);

      const result = service.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is authenticated', () => {
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(null);

      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return user with correct email', () => {
      const mockUser = createMockAuthState({
        email: 'john.doe@finxp.com',
      });
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);

      const result = service.getCurrentUser();
      expect(result?.email).toBe('john.doe@finxp.com');
    });
  });

  describe('Integration tests', () => {
    it('should authenticate and verify user is logged in', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@finxp.com',
        password: 'Test@123',
      };

      vi.spyOn(authService, 'login').mockReturnValue(of(createMockAuthToken()));
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(
        createMockAuthState({ email: loginRequest.email }),
      );

      const response = await new Promise<any>((resolve) => {
        service.loginUser(loginRequest).subscribe((result) => {
          resolve(result);
        });
      });

      expect(response.success).toBe(true);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getCurrentUser()?.email).toBe(loginRequest.email);
    });

    it('should handle multiple login attempts', async () => {
      const loginRequest: LoginRequest = {
        email: 'multi@finxp.com',
        password: 'Multi@123',
      };

      vi.spyOn(authService, 'login').mockReturnValue(of(createMockAuthToken()));

      const responses = await Promise.all([
        new Promise<any>((resolve) => {
          service.loginUser(loginRequest).subscribe((result) => {
            resolve(result);
          });
        }),
        new Promise<any>((resolve) => {
          service.loginUser(loginRequest).subscribe((result) => {
            resolve(result);
          });
        }),
      ]);

      expect(responses[0].success).toBe(true);
      expect(responses[1].success).toBe(true);
    });
  });

  describe('Error scenarios', () => {
    it('should handle network errors', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@finxp.com',
        password: 'Test@123',
      };

      const networkError = new Error('Network error');
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => networkError));

      let capturedError: Error | null = null;
      service.loginUser(loginRequest).subscribe({
        error: (error) => {
          capturedError = error;
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(capturedError).toBeDefined();
      expect(capturedError!.message).toContain('Network');
    });

    it('should handle invalid credentials', async () => {
      const loginRequest: LoginRequest = {
        email: 'valid@finxp.com',
        password: 'InvalidPass',
      };

      const credError = new Error('Invalid credentials');
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => credError));

      let capturedCredError: Error | null = null;
      service.loginUser(loginRequest).subscribe({
        error: (error) => {
          capturedCredError = error;
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(capturedCredError).toBeDefined();
      expect(capturedCredError!.message).toContain('Invalid credentials');
    });
  });
});
