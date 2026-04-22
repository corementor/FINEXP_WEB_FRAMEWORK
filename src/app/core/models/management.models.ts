import { UUID } from 'crypto';

/**
 * Role model for frontend
 */
export interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  description?: string;
  permissions?: PermissionDetail[];
  state?: string;
  version?: number;
}

/**
 * Permission detail model for frontend (renamed from Permission to avoid conflicts)
 */
export interface PermissionDetail {
  id: string;
  permissionCode: string;
  permissionName: string;
  description?: string;
  resourceType?: string;
  actionType?: string;
  state?: string;
  version?: number;
}

/**
 * User model for frontend
 */
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: Role[];
  permissions?: string[];
  accountLocked?: boolean;
  failedLoginAttempts?: number;
  state?: string;
  version?: number;
}

/**
 * Create role request
 */
export interface CreateRoleRequest {
  roleCode: string;
  roleName: string;
  description?: string;
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

/**
 * Assign roles to user request
 */
export interface AssignRolesRequest {
  roleIds: string[];
}

/**
 * Add permissions to role request
 */
export interface AddPermissionsRequest {
  permissionIds: string[];
}

