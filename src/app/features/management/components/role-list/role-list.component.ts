import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleManagementService, PermissionManagementService } from '@app/core';
import { ToastService } from '@app/services/toast.service';
import type { Role, PermissionDetail, CreateRoleRequest, AddPermissionsRequest } from '@app/core/models/management.models';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {
  private readonly roleService = inject(RoleManagementService);
  private readonly permissionService = inject(PermissionManagementService);
  private readonly toastService = inject(ToastService);

  roles: Role[] = [];
  availablePermissions: PermissionDetail[] = [];
  loading = false;

  showRoleModal = false;
  showPermissionsModal = false;
  editingRole: Role | null = null;
  selectedRole: Role | null = null;
  selectedPermissionIds: string[] = [];

  roleForm: CreateRoleRequest = {
    roleCode: '',
    roleName: '',
    description: '',
  };

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  /**
   * Load all roles
   */
  loadRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (response: any) => {
        this.roles = response.result || [];
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load roles');
        this.loading = false;
      },
    });
  }

  /**
   * Load all available permissions
   */
  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (response: any) => {
        this.availablePermissions = response.result || [];
      },
      error: (err) => {
        this.toastService.error('Failed to load permissions');
      },
    });
  }

  /**
   * Open create role modal
   */
  openCreateRoleModal(): void {
    this.editingRole = null;
    this.roleForm = { roleCode: '', roleName: '', description: '' };
    this.showRoleModal = true;
  }

  /**
   * Open edit role modal
   */
  openEditRoleModal(role: Role): void {
    this.editingRole = role;
    this.roleForm = {
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description || '',
    };
    this.showRoleModal = true;
  }

  /**
   * Close role modal
   */
  closeRoleModal(): void {
    this.showRoleModal = false;
    this.editingRole = null;
    this.roleForm = { roleCode: '', roleName: '', description: '' };
  }

  /**
   * Save role (create or update)
   */
  saveRole(): void {
    if (this.editingRole) {
      // Update role
      const updateData: Role = {
        id: this.editingRole.id,
        roleCode: this.roleForm.roleCode,
        roleName: this.roleForm.roleName,
        description: this.roleForm.description,
      };
      this.roleService.updateRole(this.editingRole.id, updateData).subscribe({
        next: () => {
          this.toastService.success('Role updated successfully');
          this.closeRoleModal();
          this.loadRoles();
        },
        error: (err) => {
          this.toastService.error('Failed to update role');
        },
      });
    } else {
      // Create role
      this.roleService.createRole(this.roleForm).subscribe({
        next: () => {
          this.toastService.success('Role created successfully');
          this.closeRoleModal();
          this.loadRoles();
        },
        error: (err) => {
          this.toastService.error(err.error?.messages?.[0] || 'Failed to create role');
        },
      });
    }
  }

  /**
   * Delete role
   */
  deleteRole(roleId: string): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(roleId).subscribe({
        next: () => {
          this.toastService.success('Role deleted successfully');
          this.loadRoles();
        },
        error: (err) => {
          this.toastService.error('Failed to delete role');
        },
      });
    }
  }

  /**
   * Open permissions assignment modal
   */
  openPermissionsModal(role: Role): void {
    this.selectedRole = role;
    this.selectedPermissionIds = (role.permissions || []).map((p) => p.id);
    this.showPermissionsModal = true;
  }

  /**
   * Close permissions modal
   */
  closePermissionsModal(): void {
    this.showPermissionsModal = false;
    this.selectedRole = null;
    this.selectedPermissionIds = [];
  }

  /**
   * Check if permission is selected
   */
  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissionIds.includes(permissionId);
  }

  /**
   * Toggle permission selection
   */
  togglePermission(permissionId: string): void {
    const index = this.selectedPermissionIds.indexOf(permissionId);
    if (index > -1) {
      this.selectedPermissionIds.splice(index, 1);
    } else {
      this.selectedPermissionIds.push(permissionId);
    }
  }

  /**
   * Save permission assignments
   */
  savePermissions(): void {
    if (this.selectedRole) {
      const request: AddPermissionsRequest = {
        permissionIds: this.selectedPermissionIds,
      };
      this.roleService.addPermissionsToRole(this.selectedRole.id, request).subscribe({
        next: () => {
          this.toastService.success('Permissions assigned successfully');
          this.closePermissionsModal();
          this.loadRoles();
        },
        error: (err) => {
          this.toastService.error('Failed to assign permissions');
        },
      });
    }
  }
}

