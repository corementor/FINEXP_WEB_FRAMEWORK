import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole, Permission } from '../models/domain.models';

/**
 * Structural directive for showing elements based on user roles
 * Usage: *appHasRole="'ADMIN'" or *appHasRole="['ADMIN', 'MANAGER']"
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef<any>, { optional: true });
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  private requiredRoles: UserRole[] = [];
  private hasView = false;

  constructor() {
    effect(() => {
      // Re-evaluate whenever userRoles signal changes
      this.authService.userRoles();
      if (this.templateRef) {
        this.updateView();
      }
    });
  }

  @Input()
  set appHasRole(roles: UserRole | UserRole[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    if (this.templateRef) {
      this.updateView();
    }
  }

  private updateView(): void {
    if (!this.templateRef) return;

    const hasRole = this.requiredRoles.length === 0 || this.requiredRoles.some(role => this.authService.hasRole(role));

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

/**
 * Structural directive for showing elements based on permissions
 * Usage: *appHasPermission="'MANAGE_EMPLOYEES'" or *appHasPermission="['MANAGE_EMPLOYEES', 'DELETE_EMPLOYEE']"
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<any>, { optional: true });
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  private requiredPermissions: Permission[] = [];
  private requireAll = false;
  private hasView = false;

  constructor() {
    effect(() => {
      // Re-evaluate whenever userPermissions signal changes
      this.authService.userPermissions();
      if (this.templateRef) {
        this.updateView();
      }
    });
  }

  @Input()
  set appHasPermission(permissions: Permission | Permission[]) {
    this.requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    if (this.templateRef) {
      this.updateView();
    }
  }

  @Input()
  set appHasPermissionRequireAll(value: boolean) {
    this.requireAll = value;
    if (this.templateRef) {
      this.updateView();
    }
  }

  private updateView(): void {
    if (!this.templateRef) return;

    if (!this.requiredPermissions || this.requiredPermissions.length === 0) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
      return;
    }

    let hasPermission: boolean;

    if (this.requireAll) {
      hasPermission = this.authService.hasAllPermissions(this.requiredPermissions);
    } else {
      hasPermission = this.authService.hasAnyPermission(this.requiredPermissions);
    }

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

