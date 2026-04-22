import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionManagementService } from '../../../../core/services/management.service';
import { ToastService } from '../../../../services/toast.service';
import type { PermissionDetail } from '../../../../core/models/management.models';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permission-list.component.html',
})
export class PermissionListComponent implements OnInit {
  private readonly permissionService = inject(PermissionManagementService);
  private readonly toastService = inject(ToastService);

  permissions: PermissionDetail[] = [];
  permissionsByResource: Map<string, PermissionDetail[]> = new Map();
  loading = false;
  Array = Array;

  ngOnInit(): void {
    this.loadPermissions();
  }

  /**
   * Load all permissions
   */
  loadPermissions(): void {
    this.loading = true;
    this.permissionService.getAllPermissions().subscribe({
      next: (response: any) => {
        this.permissions = response.result || [];
        this.groupPermissionsByResource();
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load permissions');
        this.loading = false;
      },
    });
  }

  /**
   * Group permissions by resource type
   */
  private groupPermissionsByResource(): void {
    this.permissionsByResource.clear();

    this.permissions.forEach((permission) => {
      const resourceType = permission.resourceType || 'OTHER';
      if (!this.permissionsByResource.has(resourceType)) {
        this.permissionsByResource.set(resourceType, []);
      }
      this.permissionsByResource.get(resourceType)!.push(permission);
    });
  }
}

