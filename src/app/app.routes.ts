import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntitiesComponent } from './entities/entities.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { AuditTrailComponent } from './audit/audit-trail.component';
import { ManagementComponent } from './features/management/management.component';
import { EmployeeAuditComponent } from './features/employees/components/employee-audit.component';
import { authGuard, roleGuard, noAuthGuard } from './core/guards';
import { UserRole, Permission } from './core/models';
import { DashboardExampleComponent } from './shared/components/ui-base/examples.component';
import { JournalListComponent } from './features/journal/components/journal-list/journal-list.component';
import { JournalEntryPageComponent } from './features/journal/components/journal-entry-page/journal-entry-page.component';
import { ChartOfAccountsComponent } from './features/journal/components/chart-of-accounts/chart-of-accounts.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard], // Prevent logged-in users from accessing login
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // Require authentication for all child routes
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'entities', component: EntitiesComponent },
      {
        path: 'workflows',
        component: WorkflowsComponent,
        data: { permissions: [Permission.PERM_MANAGE_WORKFLOWS] },
      },
      {
        path: 'audit',
        component: AuditTrailComponent,
        data: { permissions: [Permission.PERM_VIEW_AUDIT] },
      },
      {
        path: 'employee/:employeeId/audit',
        component: EmployeeAuditComponent,
        data: { permissions: [Permission.PERM_VIEW_AUDIT] },
      },
      {
        path: 'management',
        component: ManagementComponent,
        data: { permissions: [Permission.PERM_MANAGE_ROLES] },
      },
      {
        path: 'examples',
        component: DashboardExampleComponent,
        data: { permissions: [Permission.PERM_VIEW_DASHBOARD] },
      },
      {
        path: 'journal',
        data: { permissions: [Permission.PERM_VIEW_DASHBOARD] },
        children: [
          { path: '', component: JournalListComponent },
          { path: 'new', component: JournalEntryPageComponent },
          { path: ':id/edit', component: JournalEntryPageComponent },
        ],
      },
      {
        path: 'accounting/chart-of-accounts',
        component: ChartOfAccountsComponent,
        data: { permissions: [Permission.PERM_VIEW_DASHBOARD] },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
