import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginFacadeService } from '@app/features/iam/auth/services';
import { LoggerService } from '@app/core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loginFacade = inject(LoginFacadeService);
  private readonly logger = inject(LoggerService);
  private readonly destroy$ = new Subject<void>();
  currentYear: number = new Date().getFullYear();

  loginForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  errorTimeout: any;

  ngOnInit(): void {
    // Initialize form with validation
    this.loginForm = this.fb.group({
      email: ['admin@finxp.local', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]],
    });

    // Check if already logged in
    if (this.loginFacade.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Clear error messages after 10 seconds
    this.loginForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.error) {
        this.clearError();
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.logger.warn('Login form invalid', { errors: this.loginForm.errors });
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.loginFacade
      .loginUser({ email, password })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.logger.info('Login successful', { email });
          // Add a small delay for UX feedback
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.error =
            err?.error?.message ||
            err?.message ||
            'Login failed. Please check your credentials and try again.';
          this.logger.error('Login failed', err);
          // Auto-clear error after 10 seconds
          this.setErrorTimeout();
        },
      });
  }

  private setErrorTimeout(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.clearError();
    }, 10000);
  }

  private clearError(): void {
    this.error = null;
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }
}
