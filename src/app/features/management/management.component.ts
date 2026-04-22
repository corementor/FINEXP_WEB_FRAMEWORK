import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, UserListComponent, RoleListComponent, PermissionListComponent],
  templateUrl: './management.component.html',
})
export class ManagementComponent {
  activeTab: 'users' | 'roles' | 'permissions' = 'users';
}

