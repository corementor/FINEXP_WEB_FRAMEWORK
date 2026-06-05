import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import type { Role, PermissionDetail, User, CreateRoleRequest, CreateUserRequest, AssignRolesRequest, AddPermissionsRequest } from '../models/management.models';

/**
 * Service for role management operations
 */
@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);

  /**
   * Get all roles
   */
  getAllRoles(): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/roles`);
  }

  /**
   * Get role by ID
   */
  getRoleById(roleId: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/roles/${roleId}`);
  }

  /**
   * Create a new role
   */
  createRole(request: CreateRoleRequest): Observable<any> {
    return this.http.post(`${this.config.baseUrl}/roles`, request);
  }

  /**
   * Update role
   */
  updateRole(roleId: string, role: Role): Observable<any> {
    return this.http.put(`${this.config.baseUrl}/roles/${roleId}`, role);
  }

  /**
   * Delete role
   */
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.config.baseUrl}/roles/${roleId}`);
  }

  /**
   * Get permissions for a role
   */
  getRolePermissions(roleId: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/roles/${roleId}/permissions`);
  }

  /**
   * Add permissions to role
   */
  addPermissionsToRole(roleId: string, request: AddPermissionsRequest): Observable<any> {
    return this.http.post(`${this.config.baseUrl}/roles/${roleId}/permissions`, request);
  }

  /**
   * Remove permission from role
   */
  removePermissionFromRole(roleId: string, permissionId: string): Observable<any> {
    return this.http.delete(`${this.config.baseUrl}/roles/${roleId}/permissions/${permissionId}`);
  }
}

/**
 * Service for permission management operations
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionManagementService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);

  /**
   * Get all permissions
   */
  getAllPermissions(): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/permissions`);
  }

  /**
   * Get permission by code
   */
  getPermissionByCode(code: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/permissions/code/${code}`);
  }

  /**
   * Get permissions by resource type
   */
  getPermissionsByResourceType(resourceType: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/permissions/resource/${resourceType}`);
  }
}

/**
 * Service for user management operations
 */
@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);

  /**
   * Get all users
   */
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/users`);
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/users/${userId}`);
  }

  /**
   * Create a new user
   */
  createUser(request: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.config.baseUrl}/users`, request);
  }

  /**
   * Update user
   */
  updateUser(userId: string, user: User): Observable<any> {
    return this.http.put(`${this.config.baseUrl}/users/${userId}`, user);
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.config.baseUrl}/users/${userId}`);
  }

  /**
   * Get user roles
   */
  getUserRoles(userId: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/users/${userId}/roles`);
  }

  /**
   * Assign roles to user
   */
  assignRolesToUser(userId: string, request: AssignRolesRequest): Observable<any> {
    return this.http.post(`${this.config.baseUrl}/users/${userId}/roles`, request);
  }

  /**
   * Remove role from user
   */
  removeRoleFromUser(userId: string, roleId: string): Observable<any> {
    return this.http.delete(`${this.config.baseUrl}/users/${userId}/roles/${roleId}`);
  }
}

