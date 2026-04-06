import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntitiesComponent } from './entities/entities.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { AuditTrailComponent } from './audit/audit-trail.component';
import { EmployeeAuditComponent } from './features/employees/components/employee-audit.component';
import { authGuard, roleGuard, noAuthGuard } from './core/guards';
import { UserRole, Permission } from './core/models';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [noAuthGuard] // Prevent logged-in users from accessing login
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
        data: { permissions: [Permission.MANAGE_WORKFLOWS] }
      },
      { 
        path: 'audit', 
        component: AuditTrailComponent,
        data: { permissions: [Permission.VIEW_AUDIT] }
      },
      {
        path: 'employee/:employeeId/audit',
        component: EmployeeAuditComponent,
        data: { permissions: [Permission.VIEW_AUDIT] }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
