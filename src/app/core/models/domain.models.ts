/**
 * Lifecycle states for domain entities
 */
export enum ELifeCycle {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Security labels for data classification
 */
export enum ESecurityLabel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL',
}

/**
 * User roles for authorization
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  READONLY = 'READONLY',
}

/**
 * Permissions for fine-grained access control
 */
export enum Permission {
  // Employee Management
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES',
  CREATE_EMPLOYEE = 'CREATE_EMPLOYEE',
  UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE = 'DELETE_EMPLOYEE',

  // Workflows
  MANAGE_WORKFLOWS = 'MANAGE_WORKFLOWS',
  APPROVE_WORKFLOWS = 'APPROVE_WORKFLOWS',

  // Audit
  VIEW_AUDIT = 'VIEW_AUDIT',
  EXPORT_AUDIT = 'EXPORT_AUDIT',

  // Admin
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  VIEW_DASHBOARD= 'VIEW_DASHBOARD',
}

/**
 * Base entity properties
 */
export interface DomainEntity {
  id: string;
  version: number;
  securityLabel: ESecurityLabel;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Entity with lifecycle state
 */
export interface LifeCycleEntity extends DomainEntity {
  state: ELifeCycle;
  comments?: string;
}

/**
 * Employee domain model
 */
export interface Employee extends LifeCycleEntity {
  employeeNumber: string;
  nationalId: string;
  name: string;
  emailAddress: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  salary?: number;
  nextOfKinId?: string;
  hireDate?: string;
  terminationDate?: string;
  // Convenience property for filtering
  status?: 'active' | 'inactive';
}

/**
 * Audit trail event
 */
export interface AuditEvent extends DomainEntity {
  actionDate: string;
  userId: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  serviceClass: string;
  serviceMethod: string;
  clientIP: string;
  userAgent?: string;
  changes?: Record<string, { oldValue: any; newValue: any }>;
}

/**
 * Type alias for audit logs (same as AuditEvent)
 */
export type AuditLog = AuditEvent;

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalEntities: number;
  activeEntities: number;
  createdEntities: number;
  inactiveEntities: number;
  recentActivity: AuditEvent[];
  systemHealth: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

/**
 * User/Principal information (from auth backend when ready)
 */
export interface Principal {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  department?: string;
  lastLogin?: string;
}

/**
 * Authentication token (from auth backend when ready)
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}
