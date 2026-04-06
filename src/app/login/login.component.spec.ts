import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginFacadeService } from '@app/features/auth/services';
import { LoggerService } from '@app/core/services';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

/**
 * Login Component Unit Tests
 * Tests form submission, validation, error handling, and navigation
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginFacadeService;
  let router: Router;
  let logger: LoggerService;

  const mockLoginResponse = {
    success: true,
    message: 'Login successful',
    redirectUrl: '/dashboard',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        {
          provide: LoginFacadeService,
          useValue: {
            loginUser: vi.fn(() => of(mockLoginResponse)),
            isAuthenticated: vi.fn(() => false),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
            error: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginFacadeService);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize login form', () => {
      expect(component.loginForm).toBeDefined();
    });

    it('should set isLoading to false on init', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should initialize without error message', () => {
      expect(component.error).toBeNull();
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalidemail');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should require password field', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum password length', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('12345');
      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('Login Submission', () => {
    it('should call loginUser on form submit', async () => {
      vi.mocked(loginService.loginUser).mockReturnValue(of(mockLoginResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onLogin();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(loginService.loginUser).toHaveBeenCalled();
    });

    it('should navigate on successful login', async () => {
      vi.mocked(loginService.loginUser).mockReturnValue(of(mockLoginResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onLogin();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(router.navigate).toHaveBeenCalledWith([mockLoginResponse.redirectUrl]);
    });

    it('should show error on login failure', async () => {
      const errorMessage = 'Invalid credentials';
      vi.mocked(loginService.loginUser).mockReturnValue(throwError(() => new Error(errorMessage)));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      component.onLogin();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeTruthy();
    });

    it('should set isLoading during login', async () => {
      vi.mocked(loginService.loginUser).mockReturnValue(of(mockLoginResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onLogin();
      expect(component.isLoading).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    it('should clear isLoading after login completes', async () => {
      vi.mocked(loginService.loginUser).mockReturnValue(of(mockLoginResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onLogin();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.isLoading).toBe(false);
    });

    it('should not submit if form is invalid', () => {
      component.onLogin();
      expect(loginService.loginUser).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed login', async () => {
      const errorMessage = 'Invalid email or password';
      vi.mocked(loginService.loginUser).mockReturnValue(throwError(() => new Error(errorMessage)));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onLogin();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBe(errorMessage);
    });

    it('should clear error on new login attempt', async () => {
      component.error = 'Previous error';
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      vi.mocked(loginService.loginUser).mockReturnValue(of(mockLoginResponse));

      component.onLogin();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(component.error).toBeNull();
    });
  });

  describe('Component Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const destroySpy = vi.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
