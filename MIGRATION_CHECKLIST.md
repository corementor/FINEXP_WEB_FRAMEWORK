# Migration Checklist & Quick Reference

## Phase 1: Foundation (Weeks 1-2) ✓

### Week 1: Project Infrastructure

- [ ] **Backup current codebase**

  ```bash
  git branch backup/current-structure
  git checkout backup/current-structure
  ```

- [ ] **Create new directory structure**

  ```bash
  mkdir -p src/{core,shared,features,layout,environments}
  mkdir -p src/core/{models,services,guards,interceptors,state}
  mkdir -p src/shared/{components,pipes,directives,utils}
  mkdir -p src/features/{auth,dashboard,employees,workflows,audit}
  mkdir -p src/layout/components/{sidebar,header,main-layout}
  ```

- [ ] **Update `tsconfig.json`**

  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "strictFunctionTypes": true,
      "noImplicitThis": true,
      "alwaysStrict": true,
      "declaration": true,
      "declarationMap": true,
      "sourceMap": true,
      "outDir": "./dist"
    }
  }
  ```

- [ ] **Create environment files**

  ```typescript
  // environments/environment.ts
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    logLevel: 'info',
    enableDevTools: true,
    httpTimeout: 30000,
    cache: {
      enabled: true,
      duration: 5 * 60 * 1000, // 5 minutes
    },
  };
  ```

- [ ] **Set up core services stubs**
  - `core/services/auth.service.ts`
  - `core/services/logger.service.ts`
  - `core/services/error-handler.service.ts`
  - `core/services/api-config.service.ts`

### Week 2: Shared Components & Guards

- [ ] **Create reusable button component**
  - `shared/components/button/button.component.ts`
  - `shared/components/button/button.component.html`
  - `shared/components/button/button.component.scss`

- [ ] **Create card component**
  - `shared/components/card/card.component.ts`
  - `shared/components/card/card.component.html`
  - `shared/components/card/card.component.scss`

- [ ] **Create form input components**
  - `shared/components/form/text-input.component.ts`
  - `shared/components/form/select-input.component.ts`
  - `shared/components/form/checkbox-input.component.ts`

- [ ] **Create modal component**
  - `shared/components/modal/modal.component.ts`
  - `shared/components/modal/modal.component.html`
  - `shared/components/modal/modal.component.scss`

- [ ] **Create toast components**
  - `shared/components/toasts/toast-container.component.ts`
  - `shared/components/toasts/toast-item.component.ts`

- [ ] **Create base classes and utilities**
  - `shared/utils/validators.ts`
  - `shared/utils/formatters.ts`
  - `shared/utils/helpers.ts`
  - `shared/pipes/safe.pipe.ts`
  - `shared/pipes/date-format.pipe.ts`

- [ ] **Create auth guard**
  - `core/guards/auth.guard.ts`
  - `core/guards/role-based.guard.ts`

- [ ] **Test all shared components in isolation**

## Phase 2: Services & State (Weeks 3-4) ✓

### Week 3: Service Refactoring

- [ ] **Extract API layer services**
  - `core/services/employee.api.service.ts`
  - `core/services/audit.api.service.ts`
  - `core/services/dashboard.api.service.ts`

- [ ] **Create business logic services**
  - `core/services/employee.service.ts`
  - `core/services/audit.service.ts`
  - `core/services/dashboard.service.ts`

- [ ] **Implement error handling in services**

  ```typescript
  catchError((error) => {
    this.logger.error('Error:', error);
    return throwError(() => new AppError(error.message));
  });
  ```

- [ ] **Add retry logic**

  ```typescript
  retry({ count: 2, delay: 300 });
  ```

- [ ] **Add response validation**

  ```typescript
  map((response) => this.validateResponse(response));
  ```

- [ ] **Create HTTP Interceptors**
  - `core/interceptors/http-error.interceptor.ts`
  - `core/interceptors/http-auth.interceptor.ts`
  - `core/interceptors/http-loader.interceptor.ts`
  - `core/interceptors/http-timeout.interceptor.ts`

- [ ] **Update app.config.ts with interceptors**
  ```typescript
  provideHttpClient(
    withFetch(),
    withInterceptors([HttpAuthInterceptor, HttpLoaderInterceptor, HttpErrorInterceptor]),
  );
  ```

### Week 4: State Management

- [ ] **Create store services using Signals**
  - `core/state/employee.store.ts`
  - `core/state/auth.store.ts`
  - `core/state/ui.store.ts`

- [ ] **Implement store pattern**

  ```typescript
  @Injectable({ providedIn: 'root' })
  export class EmployeeStore {
    private readonly employees = signal<Employee[]>([]);
    readonly employees$ = toObservable(this.employees);

    loadEmployees(): void {
      /* ... */
    }
  }
  ```

- [ ] **Add computed signals for common queries**

  ```typescript
  readonly activeEmployees = computed(() =>
    this.employees().filter(e => e.state === ELifeCycle.ACTIVE)
  );
  ```

- [ ] **Connect stores to components**

## Phase 3: Feature Modules (Weeks 5-7) ✓

### Week 5: Auth Feature

- [ ] **Create auth feature structure**

  ```
  features/auth/
  ├── login/
  │   ├── login.component.ts
  │   ├── login.component.html (Extract from inline)
  │   └── login.component.scss (Extract from inline)
  ├── forgot-password/
  ├── reset-password/
  └── auth.routes.ts
  ```

- [ ] **Extract login template to separate file**
  - Copy template content to `login.component.html`
  - Create `login.component.scss`
  - Update `login.component.ts`:
    ```typescript
    @Component({
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.scss']
    })
    ```

- [ ] **Enhance login component**
  - Add email validation
  - Add password strength indicator
  - Implement remember-me functionality
  - Add two-factor authentication support
  - Add accessibility features (ARIA labels, semantic HTML)

- [ ] **Create login service (facade)**

  ```typescript
  @Injectable({ providedIn: 'root' })
  export class LoginFacade {
    login$(email: string, password: string): Observable<AuthToken> {
      // Use authService
    }
  }
  ```

- [ ] **Create auth routes with lazy loading**
  ```typescript
  export const authRoutes: Routes = [
    {
      path: 'auth',
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
      ],
    },
  ];
  ```

### Weeks 6-7: Dashboard, Employees, Workflows, Audit Features

**For each feature module:**

- [ ] **Extract components from inline templates**

- [ ] **Create page components**
  - `pages/{feature}-list.component.ts/html/scss`
  - `pages/{feature}-detail.component.ts/html/scss`
  - `pages/{feature}-form.component.ts/html/scss`

- [ ] **Create reusable feature components**
  - `components/{feature}-table/`
  - `components/{feature}-modal/`
  - `components/{feature}-filters/`

- [ ] **Create feature services**
  - Basic CRUD operations
  - Data filtering and sorting
  - Facade services for component interaction

- [ ] **Create feature-specific stores**
  - State management per feature
  - Computed signals for derived data

- [ ] **Create feature routes**
  ```typescript
  export const {feature}Routes: Routes = [
    {
      path: '{feature}',
      loadComponent: () => import('./pages/{feature}-list.component')
        .then(m => m.{Feature}ListComponent),
      canActivate: [AuthGuard]
    }
  ];
  ```

**Dashboard Feature:**

- [ ] Extract stat-card component
- [ ] Extract recent-activity component
- [ ] Extract quick-actions component
- [ ] Implement loading states
- [ ] Add error handling and retry logic

**Employees Feature:**

- [ ] Extract table component
- [ ] Extract form component (create/edit)
- [ ] Extract filters component
- [ ] Implement pagination
- [ ] Add bulk operations (export, delete multiple)

**Workflows Feature:**

- [ ] Extract workflow-column component
- [ ] Extract workflow-card component
- [ ] Implement drag-and-drop (optional)
- [ ] Add workflow state transitions

**Audit Feature:**

- [ ] Extract audit-table component
- [ ] Extract audit-filters component
- [ ] Implement date range picker
- [ ] Add export functionality

## Phase 4: Routing & Navigation (Week 8)

- [ ] **Update main app.routes.ts**

  ```typescript
  export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./features/auth/auth.routes')... },
    { path: '', component: MainLayoutComponent, canActivate: [AuthGuard], children: [...] },
    { path: '**', redirectTo: '/auth/login' }
  ];
  ```

- [ ] **Implement route guards on protected routes**

- [ ] **Add breadcrumb navigation service**

- [ ] **Implement scroll-to-top on route change**

- [ ] **Add loading bar/indicator for route transitions**

- [ ] **Update layout component**
  - Extract sidebar to separate component
  - Extract header to separate component
  - Implement responsive sidebar

- [ ] **Test all routing transitions**

## Phase 5: UI/UX Enhancements (Week 8-9)

- [ ] **Implement accessibility features**
  - Add ARIA labels to all interactive elements
  - Use semantic HTML
  - Test with screen readers
  - Check color contrast (WCAG AA)
  - Test keyboard navigation

- [ ] **Improve responsive design**
  - Test on mobile (320px+)
  - Implement sidebar toggle on mobile
  - Make modals mobile-friendly
  - Test tables on small screens

- [ ] **Add loading and error states**
  - Show spinners during API calls
  - Display error messages with retry options
  - Implement empty states
  - Add skeleton loaders

- [ ] **Enhance forms**
  - Real-time validation
  - Clear error messages
  - Success feedback
  - Prevent double submissions

- [ ] **Improve visual design**
  - Apply consistent spacing
  - Use proper typography
  - Add micro-interactions
  - Implement dark mode (optional)

## Phase 6: Testing & Quality (Week 9+)

### Unit Tests

- [ ] **Test core services**

  ```typescript
  describe('EmployeeService', () => {
    it('should load employees', (done) => {
      // Test implementation
    });
  });
  ```

- [ ] **Test store services**

  ```typescript
  describe('EmployeeStore', () => {
    it('should update employees signal', () => {
      // Test implementation
    });
  });
  ```

- [ ] **Test utility functions**

### Component Tests

- [ ] **Test shared components**
- [ ] **Test feature components**
- [ ] **Test form components**

### Integration Tests

- [ ] **Test feature workflows**
- [ ] **Test data flow from component to service**
- [ ] **Test route navigation**

### E2E Tests

- [ ] **Test login flow**
- [ ] **Test employee CRUD operations**
- [ ] **Test audit trail viewing**

### Performance Testing

- [ ] **Measure bundle size**
- [ ] **Check change detection cycles**
- [ ] **Test lazy loading performance**
- [ ] **Profile memory usage**

### Accessibility Testing

- [ ] **Use axe accessibility checker**
- [ ] **Test with screen readers**
- [ ] **Test keyboard navigation**
- [ ] **Check color contrast**

## Deployment Checklist

- [ ] **Production build test**

  ```bash
  ng build --configuration production
  ```

- [ ] **Build size analysis**

  ```bash
  npm run analyze
  ```

- [ ] **Performance audit**

  ```bash
  ng build --stats-json
  ```

- [ ] **Security audit**

  ```bash
  npm audit
  npm update
  ```

- [ ] **Final smoke tests**
  - Login flow
  - Create/Read/Update/Delete operations
  - Navigation between pages
  - Error handling

- [ ] **Deploy to staging**
- [ ] **Run smoke tests on staging**
- [ ] **Get stakeholder approval**
- [ ] **Deploy to production**
- [ ] **Monitor for errors**

## Post-Deployment

- [ ] **Monitor error tracking**
- [ ] **Check user feedback**
- [ ] **Monitor performance metrics**
- [ ] **Fix any critical issues**
- [ ] **Document lessons learned**

## File Extraction Checklist

For each component with inline templates:

```typescript
// BEFORE
@Component({
  selector: 'app-component',
  template: `<!-- 500+ characters of HTML -->`
})

// AFTER
@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
```

**Components to extract:**

- [ ] LoginComponent
- [ ] LayoutComponent
- [ ] DashboardComponent
- [ ] EntitiesComponent
- [ ] WorkflowsComponent
- [ ] AuditTrailComponent

## Command Reference

### Create component with separate files

```bash
ng generate component features/employees/components/employee-table --skip-tests
# Then manually create HTML and SCSS files
```

### Build for production

```bash
ng build --configuration production
```

### Development server

```bash
ng serve
```

### Run tests

```bash
ng test
```

### Analyze bundle

```bash
npm run build:prod && npm run analyze
```

### Update dependencies

```bash
npm update
ng update @angular/core
```

## Success Metrics

✅ **Code Quality**

- [ ] Passing unit tests (>80% coverage)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Accessibility score >90

✅ **Performance**

- [ ] Main bundle < 150KB (gzipped)
- [ ] Lazy chunks < 50KB each
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s

✅ **User Experience**

- [ ] All features working as before
- [ ] No regression bugs
- [ ] Better performance
- [ ] Better accessibility
- [ ] Better responsive design

✅ **Code Organization**

- [ ] Clear separation of concerns
- [ ] No circular dependencies
- [ ] Reusable components
- [ ] Well-documented code
- [ ] Easy to extend

## Common Pitfalls to Avoid

❌ **Don't:**

- Try to refactor everything at once
- Remove old code before new code is tested
- Skip accessibility testing
- Ignore error handling
- Create giant components
- Use default change detection if OnPush is available
- Subscribe to Observables without unsubscribing
- Create circular dependencies between modules
- Use `any` types
- Skip unit tests

✅ **Do:**

- Migrate incrementally
- Test thoroughly before removing old code
- Consider accessibility from the start
- Handle all error scenarios
- Break components into smaller pieces
- Use ChangeDetectionStrategy.OnPush
- Use takeUntil or takeUntilDestroyed
- Keep modules loosely coupled
- Use strict TypeScript
- Write tests as you go

## Quick Links

- [Angular Best Practices](https://angular.dev/guide/styleguide)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
