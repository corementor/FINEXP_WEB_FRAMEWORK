import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

/**
 * Authentication Guard (CanActivateFn)
 * Protects routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  // Check if user is authenticated
  if (!auth.isAuthenticated()) {
    logger.warn('Access denied - user not authenticated', { url: state.url });
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if session has expired
  if (auth.checkSessionExpiry()) {
    logger.warn('Access denied - session expired', { url: state.url });
    router.navigate(['/login'], { queryParams: { reason: 'session-expired' } });
    return false;
  }

  return true;
};

/**
 * Role-based Authorization Guard
 * Protects routes that require specific roles
 * Usage: path: 'admin', canActivate: [roleGuard], data: { roles: ['ADMIN'] }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  if (!auth.isAuthenticated()) {
    logger.warn('Access denied - user not authenticated', { url: state.url });
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRole = requiredRoles.some((role) => auth.hasRole(role as any));
  if (hasRole) {
    return true;
  }

  logger.warn('Access denied - insufficient role', {
    url: state.url,
    requiredRoles,
    userRoles: auth.userRoles(),
  });

  router.navigate(['/access-denied']);
  return false;
};

/**
 * Permission-based Authorization Guard
 * Protects routes that require specific permissions
 * Usage: path: 'create', canActivate: [permissionGuard], data: { permissions: ['CREATE_EMPLOYEE'] }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  if (!auth.isAuthenticated()) {
    logger.warn('Access denied - user not authenticated', { url: state.url });
    router.navigate(['/login']);
    return false;
  }

  const requiredPermissions = route.data['permissions'] as string[];
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const matchType = route.data['permissionMatchType'] || 'any'; // 'any' or 'all'

  let hasPermission = false;
  if (matchType === 'all') {
    hasPermission = auth.hasAllPermissions(requiredPermissions as any);
  } else {
    hasPermission = auth.hasAnyPermission(requiredPermissions as any);
  }

  if (hasPermission) {
    return true;
  }

  logger.warn('Access denied - insufficient permissions', {
    url: state.url,
    requiredPermissions,
    userPermissions: auth.userPermissions(),
  });

  router.navigate(['/access-denied']);
  return false;
};

/**
 * No-Auth Guard - Prevents authenticated users from accessing certain route
 * Useful for login page (redirect to dashboard if already logged in)
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  if (auth.isAuthenticated()) {
    logger.debug('Redirecting authenticated user away from no-auth route', {
      from: state.url,
      to: '/dashboard',
    });
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
