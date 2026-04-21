import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
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
export class HasRoleDirective implements OnInit {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  private requiredRoles: UserRole[] = [];

  @Input()
  set appHasRole(roles: UserRole | UserRole[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasRole = this.requiredRoles.some(role => this.authService.hasRole(role));
    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
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
export class HasPermissionDirective implements OnInit {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  private requiredPermissions: Permission[] = [];
  private requireAll = false;

  @Input()
  set appHasPermission(permissions: Permission | Permission[]) {
    this.requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  @Input()
  set appHasPermissionRequireAll(value: boolean) {
    this.requireAll = value;
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    let hasPermission: boolean;

    if (this.requireAll) {
      hasPermission = this.authService.hasAllPermissions(this.requiredPermissions);
    } else {
      hasPermission = this.authService.hasAnyPermission(this.requiredPermissions);
    }

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

