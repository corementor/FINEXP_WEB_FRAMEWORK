import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './users/components/user-list.component';
import { RoleListComponent } from './roles/components/role-list.component';
import { PermissionListComponent } from './permissions/components/permission-list.component';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, UserListComponent, RoleListComponent, PermissionListComponent],
  templateUrl: './management.component.html',
})
export class ManagementComponent {
  activeTab: 'users' | 'roles' | 'permissions' = 'users';
}

