import { Routes } from '@angular/router';
import { LoginComponent } from './features/iam/auth/components/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './features/dashboard/components/dashboard.component';
import { EntitiesComponent } from './features/hr/employees/components/entities.component';
import { WorkflowsComponent } from './features/hr/workflows/components/workflows.component';
import { AuditTrailComponent } from './features/hr/audit/components/audit-trail.component';
import { ManagementComponent } from './features/iam/management.component';
import { EmployeeAuditComponent } from './features/hr/employees/components/employee-audit.component';
import { authGuard, noAuthGuard } from './core/guards';
import { Permission } from './core/models';
import { DashboardExampleComponent } from './shared/components/ui-base/examples.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      {
        path: 'dashboard/banking',
        loadComponent: () => import('./features/dashboard/banking/bankingdashboard').then((m) => m.BankingDashboard),
        data: { breadcrumb: 'Banking Dashboard' }
      },
      {
        path: 'entities',
        component: EntitiesComponent,
        data: { breadcrumb: ['Apps', 'Employees'], permissions: [Permission.PERM_VIEW_EMPLOYEE] },
      },
      {
        path: 'workflows',
        component: WorkflowsComponent,
        data: { breadcrumb: ['Apps', 'Workflows'], permissions: [Permission.PERM_MANAGE_WORKFLOWS] },
      },
      {
        path: 'audit',
        component: AuditTrailComponent,
        data: { breadcrumb: ['Apps', 'Audit Trail'], permissions: [Permission.PERM_VIEW_AUDIT] },
      },
      {
        path: 'employee/:employeeId/audit',
        component: EmployeeAuditComponent,
        data: { breadcrumb: ['Apps', 'Employees', 'Audit'], permissions: [Permission.PERM_VIEW_AUDIT] },
      },
      {
        path: 'management',
        component: ManagementComponent,
        data: { breadcrumb: ['Apps', 'Management'], permissions: [Permission.PERM_MANAGE_ROLES] },
      },
      {
        path: 'examples',
        component: DashboardExampleComponent,
        data: { breadcrumb: 'Examples', permissions: [Permission.PERM_VIEW_DASHBOARD] },
      },
      // ── Accounting — lazy loaded to break circular dependency ──────────
      {
        path: 'journal',
        data: { breadcrumb: ['Accounting', 'Journal Entries'], permissions: [Permission.PERM_VIEW_DASHBOARD] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/accounting/journal/components/journal-list/journal-list.component').then(
                (m) => m.JournalListComponent,
              ),
          },
          {
            path: 'new',
            data: { breadcrumb: 'New Entry' },
            loadComponent: () =>
              import('./features/accounting/journal/components/journal-entry-page/journal-entry-page.component').then(
                (m) => m.JournalEntryPageComponent,
              ),
          },
          {
            path: ':id/edit',
            data: { breadcrumb: 'Edit Entry' },
            loadComponent: () =>
              import('./features/accounting/journal/components/journal-entry-page/journal-entry-page.component').then(
                (m) => m.JournalEntryPageComponent,
              ),
          },
        ],
      },

      {
        path: 'accounting/chart-of-accounts',
        loadComponent: () =>
          import('./features/accounting/chart-of-accounts/components/chart-of-accounts.component').then(
            (m) => m.ChartOfAccountsComponent,
          ),
        data: { breadcrumb: ['Accounting', 'Chart of Accounts'], permissions: [Permission.PERM_VIEW_DASHBOARD] },
      },
      {
        path: 'accounting/balance-sheet',
        loadComponent: () =>
          import('./features/accounting/balance-sheet/components/balance-sheet.component').then(
            (m) => m.BalanceSheetComponent,
          ),
        data: { breadcrumb: ['Accounting', 'Balance Sheet'], permissions: [Permission.PERM_VIEW_DASHBOARD] },
      },
      {
        path: 'accounting/trial-balance',
        loadComponent: () =>
          import('./features/accounting/trial-balance/trial-balance.component').then(
            (m) => m.TrialBalanceComponent,
          ),
        data: { breadcrumb: ['Accounting', 'Trial Balance'], permissions: [Permission.PERM_VIEW_TRIAL_BALANCE] },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
