# FINEXP Web Framework

An enterprise-grade Angular 21 frontend for the FinXP financial management platform. It covers HR management, accounting/finance, identity & access management (IAM), and audit tracking — all backed by server-side rendering (SSR) and a signals-based reactive state layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components, SSR) |
| UI Library | PrimeNG 21 + PrimeIcons + Aura theme |
| Styling | Tailwind CSS 4 + SCSS |
| Data Fetching | TanStack Query for Angular |
| State Management | Angular Signals (`AppStateStore`) |
| HTTP | Angular HttpClient with interceptors |
| Auth | JWT Bearer tokens + mock mode |
| Testing | Vitest |
| Node / Package Manager | Node 20+ / npm 11 |

---

## Prerequisites

- Node.js >= 20
- npm >= 11
- Angular CLI >= 21 (`npm i -g @angular/cli`)

---

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd FINEXP_WEB_FRAMEWORK

# 2. Install dependencies
npm install

# 3. Configure environment (optional — mock mode works out of the box)
cp .env.example .env
# Edit .env to point at your backend if needed

# 4. Start the dev server
npm start
# App runs at http://localhost:4200
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server on port 4200 |
| `npm run build` | Production SSR build |
| `npm run watch` | Incremental dev build with watch |
| `npm test` | Run unit tests via Vitest |
| `npm run serve:ssr:finxp_web_service` | Serve the SSR production build |

---

## Project Structure

```
src/
├── app/
│   ├── core/                   # Singleton services, guards, interceptors, models
│   │   ├── directives/         # Auth-based structural directives
│   │   ├── guards/             # authGuard, noAuthGuard, roleGuard, permissionGuard
│   │   ├── interceptors/       # Auth, Error, Loading HTTP interceptors
│   │   ├── models/             # Domain, API, error, journal & management models
│   │   ├── services/           # Auth, API config, logger, employee, audit, dashboard APIs
│   │   └── state/              # AppStateStore — signals-based global state
│   ├── features/
│   │   ├── accounting/         # Journal entries, chart of accounts, balance sheet, trial balance
│   │   ├── dashboard/          # Dashboard stats & activity
│   │   ├── hr/                 # Employees, workflows, audit trail
│   │   └── iam/                # Login, users, roles, permissions management
│   ├── layout/                 # App shell: header, sidebar, breadcrumb, notifications
│   ├── shared/                 # Reusable UI components (button, card, modal, table, spinner, etc.)
│   └── models/                 # App-level models
├── assets/                     # SCSS, Tailwind, layout styles
├── environments/               # environment.ts (dev) / environment.prod.ts (prod)
└── styles.css
```

---

## Features

### Authentication & Session Management
- JWT-based login with Bearer token injection via `AuthInterceptor`
- 30-minute session timeout with auto-logout
- Token auto-refresh every 5 minutes
- Auth state persisted to `localStorage`
- Mock auth mode for frontend development without a backend

### Role-Based Access Control (RBAC)
- Roles: `ADMIN`, `MANAGER`, `USER`, `READONLY`
- Fine-grained permissions (60+ permission codes across HR, accounting, IAM, and system modules)
- Route guards: `authGuard`, `noAuthGuard`, `roleGuard`, `permissionGuard`
- Permission directives for template-level visibility control

### HR Module
- **Entities** — Employee list with lifecycle management (CREATED → ACTIVE → INACTIVE → ARCHIVED)
- **Workflows** — Approval workflow management
- **Audit Trail** — System-wide and per-employee audit logs (CREATE / READ / UPDATE / DELETE)

### Accounting Module (lazy-loaded)
- **Journal Entries** — Create, edit, and list double-entry journal records
- **Chart of Accounts** — Account structure management
- **Balance Sheet** — Financial position reporting
- **Trial Balance** — Debit/credit balance verification

### IAM Module
- **Users** — User creation and role assignment
- **Roles** — Role creation and permission assignment
- **Permissions** — Permission listing and management

### Dashboard
- Entity statistics (total, active, created, inactive)
- System health indicators (uptime, memory, CPU)
- Recent activity feed

---

## Environment Configuration

### `src/environments/environment.ts` (development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080/api/auth',
  logLevel: 'debug',
  enableDevTools: true,
  httpTimeout: 30000,
  cache: { enabled: true, duration: 300000 },
  mockAuth: {
    enabled: true,          // ← set to false when backend is ready
    autoLoginEmail: 'admin@finxp.local',
  },
};
```

### `.env` (from `.env.example`)

```env
NG_APP_API_URL=http://localhost:8080/api
NG_APP_AUTH_URL=http://localhost:8080/api/auth
NG_APP_USE_REAL_BACKEND=false
```

> Set `mockAuth.enabled: false` and `NG_APP_USE_REAL_BACKEND=true` when connecting to a real backend.

---

## HTTP Interceptors

| Interceptor | Responsibility |
|---|---|
| `AuthInterceptor` | Injects `Authorization: Bearer <token>` on every request (skips `/login`, `/register`, `/refresh-token`) |
| `LoadingInterceptor` | Tracks in-flight requests to drive global loading state |
| `ErrorInterceptor` | Centralised HTTP error handling |

---

## State Management

`AppStateStore` (Angular Signals, `providedIn: 'root'`) holds:

| Signal | Type | Description |
|---|---|---|
| `employees` | `Employee[]` | Full employee list |
| `selectedEmployee` | `Employee \| null` | Currently selected employee |
| `auditLogs` | `AuditLog[]` | Recent audit events |
| `isLoading` | `boolean` | Global loading flag |
| `error` | `string \| null` | Global error message |

Computed: `employeeCount`, `activeEmployees`, `inactiveEmployees`, `hasError`.

---

## Routing

| Path | Component | Guard / Permission |
|---|---|---|
| `/login` | `LoginComponent` | `noAuthGuard` |
| `/dashboard` | `DashboardComponent` | `authGuard` |
| `/entities` | `EntitiesComponent` | `PERM_VIEW_EMPLOYEE` |
| `/workflows` | `WorkflowsComponent` | `PERM_MANAGE_WORKFLOWS` |
| `/audit` | `AuditTrailComponent` | `PERM_VIEW_AUDIT` |
| `/employee/:id/audit` | `EmployeeAuditComponent` | `PERM_VIEW_AUDIT` |
| `/management` | `ManagementComponent` | `PERM_MANAGE_ROLES` |
| `/journal` | `JournalListComponent` | lazy-loaded |
| `/journal/new` | `JournalEntryPageComponent` | lazy-loaded |
| `/accounting/chart-of-accounts` | `ChartOfAccountsComponent` | lazy-loaded |
| `/accounting/balance-sheet` | `BalanceSheetComponent` | lazy-loaded |
| `/accounting/trial-balance` | `TrialBalanceComponent` | `PERM_VIEW_TRIAL_BALANCE` |

---

## Building for Production

```bash
npm run build
# Output: dist/finxp_web_service/

# Serve SSR build
npm run serve:ssr:finxp_web_service
```

Production build enforces:
- Initial bundle warning at 1 MB / error at 5 MB
- Component style warning at 4 kB / error at 8 kB
- Output hashing for cache busting

---

## Running Tests

```bash
npm test
```

Tests use **Vitest** and are co-located with their components (`.spec.ts` files).

---

## Code Style

- Formatter: **Prettier** (config in `.prettierrc`)
- Editor: `.editorconfig` enforces indent/line-ending consistency
- Components follow Angular standalone component pattern
- Facade services abstract data-fetching logic from components
