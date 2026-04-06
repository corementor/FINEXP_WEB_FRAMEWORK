# FinXP Framework - Comprehensive Architecture Review & Refactoring Plan

## Executive Summary

This document provides a complete review of the FinXP Framework Angular application, identifying architectural gaps and proposing a modern, scalable refactoring strategy aligned with Angular best practices, including feature modules, lazy loading, reactive forms, immutable services, and accessible UI/UX design.

---

## Part 1: Current Architecture Analysis

### 1.1 Overall Project Structure

**Current Status**: Standalone components with mixed patterns

- **Angular Version**: 21.2.0 (Latest - Excellent!)
- **Build Tool**: @angular/build with SSR support
- **Styling**: Tailwind CSS 4.1 (Excellent choice)
- **State Management**: RxJS Observables + Signals
- **Component Pattern**: Standalone components with inline templates
- **Package Manager**: npm 11.11.0

### 1.2 Structural Organization

```
src/app/
├── app.ts (Root component)
├── app.routes.ts (Routing configuration)
├── app.config.ts (Application configuration)
├── app.html (Inline template)
├── app.css (Global styles)
├── models/
│   └── finxp.models.ts (Domain models)
├── services/
│   ├── finxp.service.ts (Monolithic service)
│   └── toast.service.ts (Toast notifications)
├── login/
│   └── login.component.ts (Inline template)
├── layout/
│   └── layout.component.ts (Inline template)
├── dashboard/
│   └── dashboard.component.ts (Inline template)
├── entities/
│   └── entities.component.ts (Inline template)
├── workflows/
│   └── workflows.component.ts (Inline template)
└── audit/
    └── audit-trail.component.ts (Inline template)
```

### 1.3 Routing Architecture

**Current State**: Flat routing structure with no lazy loading

```
Routes:
├── /login → LoginComponent (no guards)
├── / (layout)
│   ├── /dashboard → DashboardComponent
│   ├── /entities → EntitiesComponent
│   ├── /workflows → WorkflowsComponent
│   ├── /audit → AuditTrailComponent
│   └── '' → Redirect to /dashboard
└── /** → Redirect to /login
```

**Issues**:

1. ❌ No route guards for authentication
2. ❌ No lazy loading - all components loaded at startup
3. ❌ No feature modules - single monolithic app module
4. ❌ No route-level error handling
5. ❌ No redirects based on user roles

### 1.4 Services Architecture

**Current State**: Monolithic FinxpService

```typescript
FinxpService (God Object)
├── Employee Management API
│   ├── getEmployees()
│   ├── getEmployeeById()
│   ├── createEmployee()
│   ├── updateEmployee()
│   ├── activateEmployee()
│   └── deactivateEmployee()
├── Audit Trail API
│   ├── getAuditTrail()
│   └── getEmployeeAuditTrail()
└── Dashboard API
    └── getDashboardStats()
```

**Issues**:

1. ❌ Single Responsibility Principle violated
2. ❌ No service layer abstraction
3. ❌ No HTTP error handling
4. ❌ No request/response interceptors
5. ❌ No caching strategy
6. ❌ No retry logic
7. ❌ Direct Observable exposure (not reactive patterns)

### 1.5 Component Architecture

**Current State**: Mixed inline/reactive patterns

**Dashboard Component Issues**:

- ❌ Inline template (2000+ characters)
- ❌ Template and logic in single file
- ❌ No loading state
- ❌ No error handling
- ❌ Direct Observable subscription (memory leak risk)
- ❌ No unsubscribe/takeUntil pattern

**Entities Component Issues**:

- ❌ 500+ line component file
- ❌ Inline modal UI mixed with table
- ❌ Template-driven + Reactive forms mixed
- ❌ No proper form validation messages
- ❌ No loading states during API calls
- ❌ No error recovery
- ❌ No accessibility features (ARIA labels)

**Login Component Issues**:

- ❌ No real authentication
- ❌ No remember-me capability
- ❌ No error handling
- ❌ No email validation
- ❌ No password strength indicator
- ❌ No accessibility (no ARIA labels, semantic HTML)
- ❌ No loading state during login attempt

**Layout Component Issues**:

- ❌ Inline navigation template (500+ characters)
- ❌ Sidebar + header + main in single component
- ❌ No responsive design (sidebar doesn't collapse on mobile)
- ❌ No nested outlet for breadcrumbs
- ❌ Toast service but not used throughout

### 1.6 State Management Issues

**Current Issues**:

1. ❌ No centralized state management
2. ❌ Each component manages its own state
3. ❌ No reactive data flow
4. ❌ Observable subscriptions not unsubscribed
5. ❌ No cache invalidation strategy
6. ❌ Repeated data fetching (not utilizing Angular Query)
7. ⚠️ Angular Query imported but not used

### 1.7 TypeScript & Type Safety

**Current Issues**:

1. ⚠️ Models exist but with minimal typing
2. ❌ `any` type used in dashboard stats
3. ❌ No strict null checks enforced
4. ❌ No discriminated unions for API responses
5. ❌ No type guards for server responses

### 1.8 UI/UX & Accessibility Issues

**Current State**: Basic Tailwind styling without Material components

**General Issues**:

- ❌ No accessibility (WCAG 2.1 AA) compliance
- ❌ No proper color contrast checks
- ❌ No semantic HTML structure
- ❌ No ARIA labels for interactive elements
- ❌ No keyboard navigation support
- ❌ No focus management
- ❌ No screen reader optimization

**Specific Issues**:

1. **Login Page**:
   - No email validation feedback
   - No password strength indicator
   - No "forgot password" flow
   - No remember-me option
   - No 2FA support

2. **Responsive Design**:
   - Sidebar not responsive on mobile
   - Tables not scrollable properly
   - Modals not optimized for small screens
   - No touch-friendly controls

3. **Forms**:
   - Mixed validation approaches
   - No real-time validation feedback
   - Limited error messages
   - No loading states during submission

4. **Component Reusability**:
   - No reusable form components
   - No button variants
   - No card components
   - No modal service

### 1.9 Error Handling & Resilience

**Current Issues**:

1. ❌ No HTTP error interceptor
2. ❌ No retry logic
3. ❌ No timeout handling
4. ❌ No offline detection
5. ❌ No proper error messages to users
6. ❌ No logging/monitoring

### 1.10 Performance Issues

**Current Issues**:

1. ❌ No lazy loading (all components loaded at startup)
2. ⚠️ Angular Query unused (could optimize data fetching)
3. ❌ No performance budgets defined
4. ❌ No OnPush change detection strategy
5. ❌ No trackBy functions in \*ngFor loops
6. ⚠️ SSR configured but not optimized

### 1.11 Testing & Quality

**Current State**:

- Uses Vitest/Jasmine
- No unit tests found
- No integration tests
- No e2e tests

---

## Part 2: Best Practices Violations

| Best Practice               | Current State       | Status      |
| --------------------------- | ------------------- | ----------- |
| **Separation of Concerns**  | Templates inline    | ❌ Critical |
| **Single Responsibility**   | Monolithic services | ❌ Critical |
| **Feature Modules**         | No modules          | ❌ Critical |
| **Lazy Loading**            | All routes eager    | ❌ Critical |
| **Route Guards**            | None present        | ❌ Critical |
| **Reactive Forms**          | Mixed approach      | ⚠️ Major    |
| **Error Handling**          | Minimal/Missing     | ❌ Critical |
| **Type Safety**             | Partial             | ⚠️ Major    |
| **Accessibility**           | None                | ❌ Critical |
| **Component Reusability**   | Low                 | ⚠️ Major    |
| **OnPush Change Detection** | Default             | ⚠️ Major    |
| **Unsubscribe Pattern**     | Not implemented     | ❌ Critical |
| **API Interceptors**        | Not used            | ❌ Critical |
| **Environment Variables**   | Partial             | ⚠️ Minor    |

---

## Part 3: Proposed Refactored Architecture

### 3.1 New Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── domain.models.ts
│   │   │   ├── api-response.model.ts
│   │   │   ├── employee.model.ts
│   │   │   └── audit.model.ts
│   │   ├── services/
│   │   │   ├── employee.service.ts
│   │   │   ├── audit.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── toast.service.ts
│   │   │   └── logger.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role-based.guard.ts
│   │   ├── interceptors/
│   │   │   ├── http-error.interceptor.ts
│   │   │   ├── http-loader.interceptor.ts
│   │   │   └── http-auth.interceptor.ts
│   │   ├── state/ (NgRx or Signals)
│   │   │   ├── employee.store.ts
│   │   │   ├── auth.store.ts
│   │   │   └── ui.store.ts
│   │   └── enums/
│   │       ├── http-status.enum.ts
│   │       └── user-role.enum.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── buttons/
│   │   │   │   ├── button.component.ts
│   │   │   │   ├── button.component.html
│   │   │   │   └── button.component.scss
│   │   │   ├── cards/
│   │   │   │   ├── card.component.ts
│   │   │   │   ├── card.component.html
│   │   │   │   └── card.component.scss
│   │   │   ├── modals/
│   │   │   │   ├── modal.component.ts
│   │   │   │   ├── modal.component.html
│   │   │   │   └── modal.component.scss
│   │   │   ├── forms/
│   │   │   │   ├── text-input.component.ts
│   │   │   │   ├── select-input.component.ts
│   │   │   │   └── form-error.component.ts
│   │   │   └── toasts/
│   │   │       ├── toast-container.component.ts
│   │   │       ├── toast-container.component.html
│   │   │       └── toast-item.component.ts
│   │   ├── pipes/
│   │   │   ├── safe.pipe.ts
│   │   │   ├── date-format.pipe.ts
│   │   │   └── truncate.pipe.ts
│   │   ├── directives/
│   │   │   ├── click-outside.directive.ts
│   │   │   ├── auto-focus.directive.ts
│   │   │   └── permission.directive.ts
│   │   └── utils/
│   │       ├── validators.ts
│   │       ├── formatters.ts
│   │       └── helpers.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.scss
│   │   │   │   └── login.routes.ts
│   │   │   └── auth.module.ts
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.scss
│   │   │   ├── components/
│   │   │   │   ├── stat-card/
│   │   │   │   ├── recent-activity/
│   │   │   │   └── quick-actions/
│   │   │   ├── services/
│   │   │   │   └── dashboard.service.ts
│   │   │   ├── models/
│   │   │   │   └── dashboard.model.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── employees/
│   │   │   ├── pages/
│   │   │   │   ├── employees-list.component.ts
│   │   │   │   ├── employee-detail.component.ts
│   │   │   │   └── employee-form.component.ts
│   │   │   ├── components/
│   │   │   │   ├── employee-table/
│   │   │   │   ├── employee-modal/
│   │   │   │   └── employee-filters/
│   │   │   ├── services/
│   │   │   │   ├── employee-facade.service.ts
│   │   │   │   └── employee-form.service.ts
│   │   │   ├── models/
│   │   │   │   └── employee-form.model.ts
│   │   │   └── employees.routes.ts
│   │   ├── workflows/
│   │   │   ├── pages/
│   │   │   │   └── workflow-board.component.ts
│   │   │   ├── components/
│   │   │   │   ├── workflow-column/
│   │   │   │   └── workflow-card/
│   │   │   ├── services/
│   │   │   │   └── workflow.service.ts
│   │   │   └── workflows.routes.ts
│   │   └── audit/
│   │       ├── pages/
│   │       │   └── audit-trail.component.ts
│   │       ├── components/
│   │       │   ├── audit-table/
│   │       │   └── audit-filters/
│   │       ├── services/
│   │       │   └── audit-facade.service.ts
│   │       └── audit.routes.ts
│   ├── layout/
│   │   ├── components/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   ├── sidebar.component.html
│   │   │   │   └── sidebar.component.scss
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.scss
│   │   │   └── main-layout/
│   │   │       ├── main-layout.component.ts
│   │   │       ├── main-layout.component.html
│   │   │       └── main-layout.component.scss
│   │   └── layout.routes.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   └── app.html
├── environments/
│   ├── environment.ts
│   ├── environment.prod.ts
│   └── environment.dev.ts
├── assets/
├── styles/
│   ├── global.scss
│   ├── variables.scss
│   ├── mixins.scss
│   └── tailwind.config.ts
├── index.html
├── main.ts
└── main.server.ts
```

### 3.2 Feature Module Organization

```typescript
// auth.routes.ts
export const authRoutes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot Password' },
      },
    ],
  },
];

// app.routes.ts
export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        data: { title: 'Dashboard' },
        canActivate: [PermissionGuard('VIEW_DASHBOARD')],
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/pages/employees-list.component').then(
            (m) => m.EmployeesListComponent,
          ),
        data: { title: 'Employees' },
        canActivate: [PermissionGuard('MANAGE_EMPLOYEES')],
      },
      // ... more lazy-loaded routes
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];
```

### 3.3 Service Architecture

**Layered Service Pattern:**

```typescript
// Core Service Layer (Data)
@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly baseUrl = inject(ApiConfigService).employeeEndpoint;
  private readonly http = inject(HttpClient);

  getEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.baseUrl}`);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.baseUrl}`, employee);
  }
  // ... more methods
}

// Business Logic Layer
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apiService = inject(EmployeeApiService);
  private readonly toastService = inject(ToastService);

  getEmployees(): Observable<Employee[]> {
    return this.apiService.getEmployees().pipe(
      map((response) => this.validateResponse(response)),
      catchError((error) => this.handleError(error)),
      shareReplay(1),
    );
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.apiService.createEmployee(employee).pipe(
      tap(() => this.toastService.success('Employee created successfully')),
      catchError((error) => {
        this.toastService.error('Failed to create employee');
        return throwError(() => error);
      }),
    );
  }

  private validateResponse(response: ApiResponse<any>): any {
    if (!response || !response.result) {
      throw new Error('Invalid API response');
    }
    return response.result;
  }

  private handleError(error: any): Observable<never> {
    // Error handling logic
    return throwError(() => error);
  }
}

// Facade Service (Simplifies component interaction)
@Injectable({ providedIn: 'root' })
export class EmployeeFacadeService {
  private readonly employeeService = inject(EmployeeService);
  private readonly store = inject(EmployeeStore);

  employees$ = this.store.employees$;
  loading$ = this.store.loading$;
  error$ = this.store.error$;

  loadEmployees(): void {
    this.store.loadEmployees();
  }

  createEmployee(employee: CreateEmployeeDto): void {
    this.store.createEmployee(employee);
  }
  // ... more methods
}
```

### 3.4 State Management Pattern (Signals-based)

```typescript
// employee.store.ts
@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private readonly employeeService = inject(EmployeeService);

  // State signals
  private employees = signal<Employee[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  private selectedEmployee = signal<Employee | null>(null);

  // Public observables
  employees$ = toObservable(this.employees);
  loading$ = toObservable(this.loading);
  error$ = toObservable(this.error);
  selectedEmployee$ = toObservable(this.selectedEmployee);

  // Computed signals
  activeEmployees = computed(() => this.employees().filter((e) => e.state === ELifeCycle.ACTIVE));

  loadEmployees(): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeeService
      .getEmployees()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (employees) => this.employees.set(employees),
        error: (err) => this.error.set(err.message),
      });
  }

  createEmployee(employee: CreateEmployeeDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeeService
      .createEmployee(employee)
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (created) => {
          this.employees.update((e) => [created, ...e]);
        },
        error: (err) => this.error.set(err.message),
      });
  }

  // ... more methods
}
```

### 3.5 Route Guards

```typescript
// auth.guard.ts
@Injectable({ providedIn: 'root' })
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

// permission.guard.ts
@Injectable({ providedIn: 'root' })
export const PermissionGuard = (permission: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasPermission(permission)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
```

### 3.6 HTTP Interceptors

```typescript
// http-error.interceptor.ts
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.toastService.error('Unauthorized');
            this.router.navigate(['/auth/login']);
            break;
          case 403:
            this.toastService.error('Access denied');
            break;
          case 404:
            this.toastService.error('Resource not found');
            break;
          case 500:
            this.toastService.error('Server error');
            break;
          default:
            this.toastService.error('An error occurred');
        }
        return throwError(() => error);
      }),
      retry({ count: 2, delay: 300 }),
    );
  }
}
```

---

## Part 4: UI/UX Redesign & Accessibility

### 4.1 Design System Overview

**Color Palette**:

```scss
$primary: #3b82f6; // Blue
$secondary: #10b981; // Green
$danger: #ef4444; // Red
$warning: #f59e0b; // Amber
$success: #10b981; // Green
$info: #3b82f6; // Blue
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-500: #6b7280;
$gray-900: #111827;
```

**Typography**:

```scss
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI';
$font-mono: 'Monaco', 'Menlo', monospace;

// Scales
h1: 2.5rem, 600 weight
h2: 2rem, 600 weight
h3: 1.5rem, 600 weight
body: 1rem, 400 weight
caption: 0.875rem, 400 weight
```

**Spacing System** (8px base):

```
xs: 0.25rem
sm: 0.5rem
md: 1rem
lg: 1.5rem
xl: 2rem
2xl: 3rem
```

### 4.2 Component Library

**Buttons**:

```typescript
// shared/components/button/button.component.ts
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() ariaLabel: string | null = null;
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
```

**Cards**:

```typescript
// shared/components/card/card.component.ts
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
})
export class CardComponent {
  @Input() title: string | null = null;
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'accent' | 'warning' | 'error' = 'default';
}
```

**Form Inputs**:

```typescript
// shared/components/form/text-input.component.ts
@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TextInputComponent {
  @Input() control!: FormControl;
  @Input() label: string | null = null;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() required = false;
  @Input() ariaDescribedBy: string | null = null;

  get errorMessage(): string | null {
    if (this.control.hasError('required')) {
      return `${this.label} is required`;
    }
    if (this.control.hasError('email')) {
      return 'Invalid email address';
    }
    if (this.control.hasError('minlength')) {
      return `Minimum ${this.control.getError('minlength').requiredLength} characters`;
    }
    return null;
  }
}
```

### 4.3 Login Page Redesign

**Accessibility & UX Enhancements**:

```typescript
// features/auth/login/login.component.ts
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TextInputComponent, CardComponent],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = signal(false);
  showPassword = signal(false);
  rememberMe = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.loadSavedEmail();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator()]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()],
      ],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password, rememberMe } = this.form.value;

    this.authService
      .login(email, password)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => {
          if (rememberMe) {
            this.saveEmail(email);
          }
          this.toastService.success('Login successful');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Invalid credentials');
          this.toastService.error('Login failed');
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  private emailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const domain = control.value.split('@')[1];
      const blockedDomains = ['tempmail.com', 'disposable.com'];
      return blockedDomains.includes(domain) ? { invalidDomain: true } : null;
    };
  }

  private passwordStrengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const isStrong = hasUpperCase && hasLowerCase && hasNumber;
      return !isStrong ? { weakPassword: true } : null;
    };
  }

  private saveEmail(email: string): void {
    localStorage.setItem('savedEmail', email);
  }

  private loadSavedEmail(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.form.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Enhanced HTML Template**:

```html
<!-- login.component.html -->
<div class="login-container">
  <main class="login-main">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header" role="banner">
        <h1 class="login-title">FinXP Framework</h1>
        <p class="login-subtitle">Secure Employee Management System</p>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" role="main">
        <!-- Error Alert -->
        @if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
          <span>{{ errorMessage() }}</span>
        </div>
        }

        <!-- Email Input -->
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-input"
            placeholder="your@email.com"
            aria-required="true"
            aria-describedby="email-error"
            autocomplete="email"
          />
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
          <p id="email-error" class="form-error">Email is required</p>
          } @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
          <p id="email-error" class="form-error">Please enter a valid email</p>
          }
        </div>

        <!-- Password Input -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="password-input-wrapper">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              id="password"
              formControlName="password"
              class="form-input"
              placeholder="••••••••"
              aria-required="true"
              aria-describedby="password-error"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="password-toggle"
              (click)="togglePasswordVisibility()"
              [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
            >
              @if (showPassword()) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M17.94 17.94A10.07 10.07 0 01 12 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              }
            </button>
          </div>
          @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
          <p id="password-error" class="form-error">Password is required</p>
          } @if (form.get('password')?.hasError('minlength') && form.get('password')?.touched) {
          <p id="password-error" class="form-error">Password must be at least 8 characters</p>
          }
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="form-footer">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="rememberMe" class="checkbox-input" />
            <span>Remember me</span>
          </label>
          <a href="/forgot-password" class="link">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary btn-lg btn-full"
          [disabled]="loading() || form.invalid"
          [attr.aria-busy]="loading()"
        >
          @if (loading()) {
          <span class="spinner"></span>
          <span>Signing in...</span>
          } @else {
          <span>Sign in</span>
          }
        </button>
      </form>

      <!-- Sign Up Link -->
      <div class="login-footer">
        <p>Don't have an account? <a href="/signup" class="link link-primary">Sign up</a></p>
      </div>
    </div>
  </main>

  <!-- Toast Container -->
  <app-toast-container role="region" aria-live="polite" aria-atomic="true"></app-toast-container>
</div>
```

**Enhanced Styling**:

```scss
// login.component.scss
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
}

.login-main {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.login-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 2rem;
  }
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.form-error {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
  font-weight: 500;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    color: #374151;
  }

  &:focus {
    outline: none;
    color: #3b82f6;
  }
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #374151;

  input {
    margin-right: 0.5rem;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.btn-primary {
  background-color: #3b82f6;
  color: white;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
}

.btn-lg {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
}

.btn-full {
  width: 100%;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
}

.login-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1.5rem;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;

  &-error {
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}
```

---

## Part 5: Step-by-Step Migration Plan

### Phase 1: Foundation & Infrastructure (Weeks 1-2)

#### Week 1: Project Setup

1. **Create new directory structure**

   ```bash
   mkdir -p src/{core,shared,features,layout,environments}
   mkdir -p src/core/{models,services,guards,interceptors,state}
   mkdir -p src/shared/{components,pipes,directives,utils}
   mkdir -p src/features/{auth,dashboard,employees,workflows,audit}
   ```

2. **Create new configuration files**
   - `app.config.base.ts` (shared config)
   - `app.config.ts` (app config with interceptors)
   - `environment.ts`, `environment.prod.ts`

3. **Set up core services**
   - `core/services/auth.service.ts`
   - `core/services/logger.service.ts`
   - `core/services/error.handler.ts`

4. **Create guards**
   - `core/guards/auth.guard.ts`
   - `core/guards/role-based.guard.ts`

5. **Create interceptors**
   - `core/interceptors/http-error.interceptor.ts`
   - `core/interceptors/http-auth.interceptor.ts`
   - `core/interceptors/http-loader.interceptor.ts`

**Deliverables**: Core infrastructure in place, no breaking changes

#### Week 2: Shared Components & Utilities

1. **Create reusable components**
   - `shared/components/button/`
   - `shared/components/card/`
   - `shared/components/modal/`
   - `shared/components/form/` (text-input, select, etc.)
   - `shared/components/toasts/`

2. **Create pipes and directives**
   - `shared/pipes/safe.pipe.ts`
   - `shared/pipes/date-format.pipe.ts`
   - `shared/directives/click-outside.directive.ts`
   - `shared/directives/auto-focus.directive.ts`

3. **Create utility functions**
   - `shared/utils/validators.ts` (custom validators)
   - `shared/utils/formatters.ts` (date, currency formatting)
   - `shared/utils/helpers.ts` (common utility functions)

**Deliverables**: Shared component library ready for feature modules

### Phase 2: Refactored Services (Weeks 3-4)

#### Week 3: Service Layer Refactoring

1. **Create layered services**

   ```typescript
   // API Layer
   -core / services / employee.api.service.ts -
     core / services / audit.api.service.ts -
     core / services / dashboard.api.service.ts -
     // Business Logic Layer
     core / services / employee.service.ts -
     core / services / audit.service.ts -
     core / services / dashboard.service.ts -
     // Facade Layer
     features / employees / services / employee -
     facade.service.ts -
     features / dashboard / services / dashboard -
     facade.service.ts;
   ```

2. **Implement error handling and retry logic**

   ```typescript
   (catchError((error) => {
     this.logger.error('API Error:', error);
     return throwError(() => new AppError(error));
   }),
     retry({ count: 2, delay: 300, resetOnSuccess: true }));
   ```

3. **Add response validation**
   ```typescript
   map((response) => {
     if (!this.isValidResponse(response)) {
       throw new Error('Invalid API response');
     }
     return response.result;
   });
   ```

**Deliverables**: All services refactored with proper error handling

#### Week 4: State Management Setup (Signals)

1. **Create store services**
   - `core/state/employee.store.ts`
   - `core/state/auth.store.ts`
   - `core/state/ui.store.ts`

2. **Implement store patterns**

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class EmployeeStore {
     private readonly employees = signal<Employee[]>([]);
     readonly employees$ = toObservable(this.employees);

     loadEmployees(): void {
       /* ... */
     }
     updateEmployee(id: string, data: Partial<Employee>): void {
       /* ... */
     }
   }
   ```

3. **Connect services to stores**

**Deliverables**: State management system in place and testable

### Phase 3: Feature Modules Refactoring (Weeks 5-7)

#### Week 5: Auth Feature Module

1. **Extract login component**
   - `features/auth/login/login.component.ts`
   - `features/auth/login/login.component.html` (separate file)
   - `features/auth/login/login.component.scss` (separate file)

2. **Create forgot password component** (phase 2 feature)
   - `features/auth/forgot-password/forgot-password.component.ts`
   - `features/auth/forgot-password/forgot-password.component.html`
   - `features/auth/forgot-password/forgot-password.component.scss`

3. **Implement auth routes with lazy loading**
   ```typescript
   export const routes: Routes = [
     {
       path: 'auth',
       loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
       canActivate: [NotAuthGuard],
     },
   ];
   ```

**Deliverables**: Auth module with separate HTML/SCSS, lazy-loaded

#### Week 6-7: Other Feature Modules

Repeat the process for:

1. **Dashboard Module**
   - Separate stat-card component
   - Separate recent-activity component
   - Main dashboard component with proper separation

2. **Employees Module**
   - Separate employee-table component
   - Separate employee-form component
   - Separate employee-modal component
   - Main list component

3. **Workflows Module**
4. **Audit Module**

**Deliverables**: All feature modules refactored with proper component separation

### Phase 4: Routing & Navigation (Week 8)

1. **Implement feature-based routing**

   ```typescript
   export const routes: Routes = [
     {
       path: 'auth',
       loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
     },
     {
       path: '',
       component: MainLayoutComponent,
       canActivate: [AuthGuard],
       children: [
         {
           path: 'dashboard',
           loadComponent: () =>
             import('./features/dashboard/pages/dashboard.component').then(
               (m) => m.DashboardComponent,
             ),
         },
         {
           path: 'employees',
           loadComponent: () =>
             import('./features/employees/pages/employees-list.component').then(
               (m) => m.EmployeesListComponent,
             ),
         },
       ],
     },
     { path: '**', redirectTo: '/auth/login' },
   ];
   ```

2. **Update route guards globally**
3. **Add breadcrumb navigation**
4. **Implement scroll-to-top on route change**

**Deliverables**: Clean routing structure with lazy loading in place

### Phase 5: Testing & Deployment (Week 9+)

1. **Unit tests** for services
2. **Component tests** for reusable components
3. **Integration tests** for feature modules
4. **E2E tests** for critical user flows
5. **Performance testing** and optimization
6. **Accessibility testing** (WCAG 2.1 AA)

---

## Part 6: Detailed Code Examples

### 6.1 Refactored Employee Service

```typescript
// core/services/employee.api.service.ts
@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);

  getEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.config.baseUrl}/employees`);
  }

  getEmployee(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.config.baseUrl}/employees/${id}`);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.config.baseUrl}/employees`, employee);
  }

  updateEmployee(id: string, employee: UpdateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.config.baseUrl}/employees/${id}`, employee);
  }

  activateEmployee(id: string): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(
      `${this.config.baseUrl}/employees/${id}/activate`,
      {},
    );
  }

  deactivateEmployee(id: string, comments: string): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(
      `${this.config.baseUrl}/employees/${id}/deactivate`,
      { comments },
    );
  }

  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.config.baseUrl}/employees/${id}`);
  }
}

// core/services/employee.service.ts
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apiService = inject(EmployeeApiService);
  private readonly logger = inject(LoggerService);
  private readonly toastService = inject(ToastService);

  getEmployees(): Observable<Employee[]> {
    return this.apiService.getEmployees().pipe(
      map((response) => this.validateAndTransform(response)),
      tap(() => this.logger.log('Employees fetched successfully')),
      catchError((error) => this.handleError('Failed to fetch employees', error)),
      shareReplay(1),
    );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.apiService.getEmployee(id).pipe(
      map((response) => this.validateAndTransform(response)),
      catchError((error) => this.handleError(`Failed to fetch employee ${id}`, error)),
      shareReplay(1),
    );
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.apiService.createEmployee(employee).pipe(
      map((response) => this.validateAndTransform(response)),
      tap(() => this.toastService.success('Employee created successfully')),
      tap(() => this.logger.log('Employee created:', employee)),
      catchError((error) => this.handleError('Failed to create employee', error)),
    );
  }

  updateEmployee(id: string, employee: UpdateEmployeeDto): Observable<Employee> {
    return this.apiService.updateEmployee(id, employee).pipe(
      map((response) => this.validateAndTransform(response)),
      tap(() => this.toastService.success('Employee updated successfully')),
      tap(() => this.logger.log('Employee updated:', id)),
      catchError((error) => this.handleError('Failed to update employee', error)),
    );
  }

  activateEmployee(id: string): Observable<Employee> {
    return this.apiService.activateEmployee(id).pipe(
      map((response) => this.validateAndTransform(response)),
      tap(() => this.toastService.success('Employee activated successfully')),
      catchError((error) => this.handleError('Failed to activate employee', error)),
    );
  }

  deactivateEmployee(id: string, comments: string): Observable<Employee> {
    return this.apiService.deactivateEmployee(id, comments).pipe(
      map((response) => this.validateAndTransform(response)),
      tap(() => this.toastService.success('Employee deactivated successfully')),
      catchError((error) => this.handleError('Failed to deactivate employee', error)),
    );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.apiService.deleteEmployee(id).pipe(
      tap(() => this.toastService.success('Employee deleted successfully')),
      tap(() => this.logger.log('Employee deleted:', id)),
      catchError((error) => this.handleError('Failed to delete employee', error)),
    );
  }

  private validateAndTransform(response: ApiResponse<any>): any {
    if (!response || !response.result) {
      throw new Error('Invalid API response structure');
    }
    if (response.messageCodes?.some((code) => code >= 400)) {
      throw new Error(response.simpleMessage || 'API error');
    }
    return response.result;
  }

  private handleError(message: string, error: any): Observable<never> {
    this.logger.error(message, error);
    this.toastService.error(message);
    return throwError(() => new AppError(message, error));
  }
}
```

### 6.2 Refactored Employee Store (Signals)

```typescript
// core/state/employee.store.ts
@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private readonly employeeService = inject(EmployeeService);
  private readonly logger = inject(LoggerService);

  // Private signals
  private readonly employees = signal<Employee[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly selectedEmployee = signal<Employee | null>(null);

  // Public read-only signals
  readonly employees$ = toObservable(this.employees);
  readonly loading$ = toObservable(this.loading);
  readonly error$ = toObservable(this.error);
  readonly selectedEmployee$ = toObservable(this.selectedEmployee);

  // Computed signals
  readonly activeEmployees = computed(() => {
    return this.employees().filter((e) => e.state === ELifeCycle.ACTIVE);
  });

  readonly inactiveEmployees = computed(() => {
    return this.employees().filter((e) => e.state === ELifeCycle.INACTIVE);
  });

  readonly createdEmployees = computed(() => {
    return this.employees().filter((e) => e.state === ELifeCycle.CREATED);
  });

  readonly employeeCount = computed(() => this.employees().length);

  private readonly destroy$ = new Subject<void>();

  loadEmployees(): void {
    if (this.loading()) return; // Prevent duplicate requests

    this.loading.set(true);
    this.error.set(null);

    this.employeeService
      .getEmployees()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (employees) => {
          this.employees.set(employees);
          this.logger.log('Employees loaded:', employees.length);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to load employees');
          this.logger.error('Failed to load employees:', err);
        },
      });
  }

  selectEmployee(id: string): void {
    const employee = this.employees().find((e) => e.id === id);
    this.selectedEmployee.set(employee || null);
  }

  createEmployee(employee: CreateEmployeeDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeeService
      .createEmployee(employee)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (created) => {
          this.employees.update((e) => [created, ...e]);
          this.logger.log('Employee created:', created.id);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to create employee');
        },
      });
  }

  updateEmployee(id: string, employee: UpdateEmployeeDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeeService
      .updateEmployee(id, employee)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (updated) => {
          this.employees.update((employees) => employees.map((e) => (e.id === id ? updated : e)));
          if (this.selectedEmployee()?.id === id) {
            this.selectedEmployee.set(updated);
          }
          this.logger.log('Employee updated:', id);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to update employee');
        },
      });
  }

  activateEmployee(id: string): void {
    this.employeeService
      .activateEmployee(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.employees.update((employees) => employees.map((e) => (e.id === id ? updated : e)));
          this.logger.log('Employee activated:', id);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to activate employee');
        },
      });
  }

  deactivateEmployee(id: string, comments: string): void {
    this.employeeService
      .deactivateEmployee(id, comments)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.employees.update((employees) => employees.map((e) => (e.id === id ? updated : e)));
          this.logger.log('Employee deactivated:', id);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to deactivate employee');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 6.3 Refactored Employees List Component

```typescript
// features/employees/pages/employees-list.component.ts
@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    EmployeeTableComponent,
    EmployeeModalComponent,
    EmployeeFiltersComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  readonly employees$ = this.store.employees$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  showModal = signal(false);
  selectedEmployee = signal<Employee | null>(null);
  isEditMode = signal(false);

  private readonly store = inject(EmployeeStore);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.store.loadEmployees();
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedEmployee.set(null);
    this.showModal.set(true);
  }

  openEditModal(employee: Employee): void {
    this.isEditMode.set(true);
    this.selectedEmployee.set(employee);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedEmployee.set(null);
  }

  onEmployeeSaved(): void {
    this.closeModal();
  }

  activateEmployee(employee: Employee): void {
    this.store.activateEmployee(employee.id);
  }

  deactivateEmployee(employee: Employee): void {
    this.store.deactivateEmployee(employee.id, 'Deactivated via UI');
  }

  viewEmployeeDetail(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```html
<!-- features/employees/pages/employees-list.component.html -->
<div class="employees-container">
  <!-- Header -->
  <div class="employees-header">
    <h1 class="page-title">Employees Management</h1>
    <button
      app-button
      variant="primary"
      (clicked)="openCreateModal()"
      aria-label="Create new employee"
    >
      + Create New Employee
    </button>
  </div>

  <!-- Filters -->
  <app-employee-filters></app-employee-filters>

  <!-- Loading State -->
  @if (loading$ | async) {
  <div class="loading-container">
    <div class="spinner" aria-label="Loading employees"></div>
    <p>Loading employees...</p>
  </div>
  }

  <!-- Error State -->
  @if (error$ | async as error) {
  <div class="error-container" role="alert">
    <p>{{ error }}</p>
    <button app-button (clicked)="store.loadEmployees()">Retry</button>
  </div>
  }

  <!-- Success State -->
  @if ((loading$ | async) === false && !(error$ | async) {
  <app-employee-table
    [employees]="employees$ | async"
    (edit)="openEditModal($event)"
    (activate)="activateEmployee($event)"
    (deactivate)="deactivateEmployee($event)"
    (view)="viewEmployeeDetail($event)"
  ></app-employee-table>

  <!-- Modal -->
  @if (showModal()) {
  <app-employee-modal
    [employee]="selectedEmployee()"
    [isEditMode]="isEditMode()"
    (saved)="onEmployeeSaved()"
    (closed)="closeModal()"
  ></app-employee-modal>
  } }
</div>
```

---

## Part 7: Critical Recommendations Summary

### Immediate Actions (Priority 1)

1. **Extract templates to separate files**
   - Move all inline templates to `.html` files
   - Move all component styles to `.scss` files
   - Improves readability and maintainability

2. **Implement authentication guard**
   - Add `AuthGuard` to protected routes
   - Add `NotAuthGuard` to auth routes
   - Prevents unauthorized access

3. **Set up HTTP error interceptor**

   ```typescript
   providers: [provideHttpClient(withInterceptors([httpErrorInterceptor, httpAuthInterceptor]))];
   ```

4. **Implement unsubscribe pattern**

   ```typescript
   private readonly destroy$ = new Subject<void>();

   constructor() {
     this.someService.load()
       .pipe(takeUntil(this.destroy$))
       .subscribe(/* ... */);
   }

   ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

### Short-Term (Priority 2 - Weeks 1-4)

1. **Refactor services into layers** (API, Business, Facade)
2. **Create shared component library** (buttons, cards, forms, modals)
3. **Implement state management** (Signals-based store)
4. **Add route guards** for authentication and authorization
5. **Improve form validation** and error messages

### Medium-Term (Priority 3 - Weeks 5-8)

1. **Implement lazy loading** for feature modules
2. **Refactor components** with proper separation of concerns
3. **Add accessibility** (WCAG 2.1 AA compliance)
4. **Redesign login page** with modern UI/UX
5. **Implement proper error handling** throughout app

### Long-Term (Priority 4 - Weeks 9+)

1. **Add comprehensive testing** (unit, integration, e2e)
2. **Implement performance monitoring**
3. **Add analytics tracking**
4. **Create documentation** (API docs, component docs)
5. **Build CI/CD pipeline** for automated testing and deployment

---

## Part 8: Performance Optimization

### Bundle Size Optimization

1. **Enable lazy loading**
   - Before: ~500KB bundle
   - After (estimated): ~200KB main bundle + lazy chunks

2. **Tree-shake unused code**

   ```typescript
   // Remove unused imports
   // Use production builds with optimization
   ```

3. **Use `ChangeDetectionStrategy.OnPush`**

   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

4. **Implement `trackBy` in loops**
   ```html
   *ngFor="let emp of employees; trackBy: trackByEmployeeId"
   ```

### Runtime Performance

1. **Use OnPush change detection** (reduce change detection cycles)
2. **Implement virtual scrolling** for large lists
3. **Use `OnPush` with immutable data structures**
4. **Lazy load images** with `loading="lazy"`
5. **Implement proper caching strategy**

---

## Conclusion

This refactored architecture provides:

✅ **Separation of Concerns**: Templates, styles, and logic in separate files  
✅ **Single Responsibility**: Focused services and components  
✅ **Feature Modules**: Organized and lazy-loaded features  
✅ **Scalability**: Easily add new features without impacting existing code  
✅ **Maintainability**: Clear structure and patterns  
✅ **Type Safety**: Improved TypeScript usage  
✅ **Accessibility**: WCAG 2.1 AA compliant  
✅ **Performance**: Lazy loading, OnPush change detection  
✅ **User Experience**: Modern, responsive, intuitive UI  
✅ **Testability**: Services and components easily testable

The step-by-step migration plan allows implementation without downtime by gradually refactoring while maintaining functionality.
