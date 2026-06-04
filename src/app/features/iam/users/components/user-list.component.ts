import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { UserManagementService, RoleManagementService } from '@app/core';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import type {
  User,
  Role,
  CreateUserRequest,
  AssignRolesRequest,
} from '@app/core/models/management.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, APP_UI_COMPONENTS],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserManagementService);
  private readonly roleService = inject(RoleManagementService);
  private readonly toastService = inject(ToastService);

  users: User[] = [];
  availableRoles: Role[] = [];
  loading = false;

  showUserModal = false;
  showRolesModal = false;
  editingUser: User | null = null;
  selectedUser: User | null = null;
  selectedRoleIds: string[] = [];

  // Table columns configuration
  userTableColumns: Array<{ field: keyof User; header: string; sortable?: boolean }> = [
    { field: 'username', header: 'Username', sortable: true },
    { field: 'email', header: 'Email' },
    { field: 'firstName', header: 'First Name', sortable: true },
    { field: 'lastName', header: 'Last Name', sortable: true },
  ];

  userForm: CreateUserRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  /**
   * Load all users
   */
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.result || [];
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error('Error', 'Failed to load users');
        this.loading = false;
      },
    });
  }

  /**
   * Load all available roles
   */
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (response: any) => {
        this.availableRoles = response.result || [];
      },
      error: (err) => {
        this.toastService.error('Error', 'Failed to load roles');
      },
    });
  }

  /**
   * Open create user modal
   */
  openCreateUserModal(): void {
    this.editingUser = null;
    this.userForm = { email: '', password: '', firstName: '', lastName: '', username: '' };
    this.showUserModal = true;
  }

  /**
   * Open edit user modal
   */
  openEditUserModal(user: User): void {
    this.editingUser = user;
    this.userForm = {
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username,
      password: '',
    };
    this.showUserModal = true;
  }

  /**
   * Close user modal
   */
  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
    this.userForm = { email: '', password: '', firstName: '', lastName: '', username: '' };
  }

  /**
   * Save user (create or update)
   */
  saveUser(): void {
    if (this.editingUser) {
      // Update user
      const updateData: User = {
        id: this.editingUser.id,
        email: this.userForm.email,
        firstName: this.userForm.firstName,
        lastName: this.userForm.lastName,
        username: this.userForm.username || '',
      };
      this.userService.updateUser(this.editingUser.id, updateData).subscribe({
        next: () => {
          this.toastService.success('Success', 'User updated successfully');
          this.closeUserModal();
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.error('Error', 'Failed to update user');
        },
      });
    } else {
      // Create user
      this.userService.createUser(this.userForm).subscribe({
        next: () => {
          this.toastService.success('Success', 'User created successfully');
          this.closeUserModal();
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.error('Error', err.error?.messages?.[0] || 'Failed to create user');
        },
      });
    }
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastService.success('Success', 'User deleted successfully');
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.error('Error', 'Failed to delete user');
        },
      });
    }
  }

  /**
   * Open roles assignment modal
   */
  openRolesModal(user: User): void {
    this.selectedUser = user;
    this.selectedRoleIds = (user.roles || []).map((r) => r.id);
    this.showRolesModal = true;
  }

  /**
   * Close roles modal
   */
  closeRolesModal(): void {
    this.showRolesModal = false;
    this.selectedUser = null;
    this.selectedRoleIds = [];
  }

  /**
   * Check if role is selected
   */
  isRoleSelected(roleId: string): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  /**
   * Toggle role selection
   */
  toggleRole(roleId: string): void {
    const index = this.selectedRoleIds.indexOf(roleId);
    if (index > -1) {
      this.selectedRoleIds.splice(index, 1);
    } else {
      this.selectedRoleIds.push(roleId);
    }
  }

  /**
   * Wrapper for toggleRole - used by template
   */
  onRoleToggle(roleId: string): void {
    this.toggleRole(roleId);
  }

  /**
   * Save role assignments
   */
  saveRoles(): void {
    if (this.selectedUser) {
      const request: AssignRolesRequest = {
        roleIds: this.selectedRoleIds,
      };
      this.userService.assignRolesToUser(this.selectedUser.id, request).subscribe({
        next: () => {
          this.toastService.success('Success', 'Roles assigned successfully');
          this.closeRolesModal();
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.error('Error', 'Failed to assign roles');
        },
      });
    }
  }

  /**
   * Wrapper for saveRoles - used by template
   */
  assignRoles(): void {
    this.saveRoles();
  }
}
