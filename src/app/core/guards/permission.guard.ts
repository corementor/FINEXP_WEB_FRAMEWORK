import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Permission Guard - Checks if user has required permissions
 * Usage in routes:
 * {
 *   path: 'employees',
 *   component: EmployeeListComponent,
 *   canActivate: [permissionGuard],
 *   data: { permissions: ['PERM_VIEW_EMPLOYEE'] }
 * }
 */
export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService = new AuthService(),
  router = new Router()
) => {
  const requiredPermissions = route.data['permissions'] as string[];
  const permissionMode = route.data['permissionMode'] || 'any'; // 'any' or 'all'

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // No specific permissions required
  }

  let hasPermission = false;
  if (permissionMode === 'all') {
    hasPermission = authService.hasAllPermissionCodes(requiredPermissions);
  } else {
    hasPermission = authService.hasAnyPermissionCode(requiredPermissions);
  }

  if (!hasPermission) {
    console.warn('Permission denied for route:', state.url, 'Required:', requiredPermissions);
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

