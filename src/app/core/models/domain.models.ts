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
  PERM_VIEW_EMPLOYEE = 'PERM_VIEW_EMPLOYEE',
  PERM_CREATE_EMPLOYEE = 'PERM_CREATE_EMPLOYEE',
  PERM_EDIT_EMPLOYEE = 'PERM_EDIT_EMPLOYEE',
  PERM_DELETE_EMPLOYEE = 'PERM_DELETE_EMPLOYEE',
  PERM_ACTIVATE_EMPLOYEE = 'PERM_ACTIVATE_EMPLOYEE',
  PERM_DEACTIVATE_EMPLOYEE = 'PERM_DEACTIVATE_EMPLOYEE',
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',

  // Workflows
  PERM_MANAGE_WORKFLOWS = 'PERM_MANAGE_WORKFLOWS',
  MANAGE_WORKFLOWS = 'MANAGE_WORKFLOWS',
  PERM_APPROVE_WORKFLOWS = 'PERM_APPROVE_WORKFLOWS',

  // Audit
  PERM_VIEW_AUDIT = 'PERM_VIEW_AUDIT',
  VIEW_AUDIT = 'VIEW_AUDIT',
  PERM_EXPORT_AUDIT = 'PERM_EXPORT_AUDIT',

  // User Management
  PERM_VIEW_USER = 'PERM_VIEW_USER',
  PERM_CREATE_USER = 'PERM_CREATE_USER',
  PERM_EDIT_USER = 'PERM_EDIT_USER',
  PERM_DELETE_USER = 'PERM_DELETE_USER',
  MANAGE_USERS = 'MANAGE_USERS',

  // Role & Permission Management
  PERM_MANAGE_ROLES = 'PERM_MANAGE_ROLES',
  MANAGE_ROLES = 'MANAGE_ROLES',
  PERM_MANAGE_PERMISSIONS = 'PERM_MANAGE_PERMISSIONS',

  // System / Dashboard
  PERM_MANAGE_SYSTEM = 'PERM_MANAGE_SYSTEM',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  PERM_VIEW_DASHBOARD = 'PERM_VIEW_DASHBOARD',
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',

  // ── Accounting / Finance ──────────────────────────────────────────────────
  // Chart of Accounts
  PERM_VIEW_COA = 'PERM_VIEW_COA',
  PERM_MANAGE_COA = 'PERM_MANAGE_COA',

  // Journal Entries
  PERM_VIEW_JOURNAL = 'PERM_VIEW_JOURNAL',
  PERM_CREATE_JOURNAL = 'PERM_CREATE_JOURNAL',
  PERM_EDIT_JOURNAL = 'PERM_EDIT_JOURNAL',
  PERM_POST_JOURNAL = 'PERM_POST_JOURNAL',
  PERM_REVERSE_JOURNAL = 'PERM_REVERSE_JOURNAL',
  PERM_DELETE_JOURNAL = 'PERM_DELETE_JOURNAL',

  // Fiscal Periods
  PERM_VIEW_FISCAL_PERIOD = 'PERM_VIEW_FISCAL_PERIOD',
  PERM_MANAGE_FISCAL_PERIOD = 'PERM_MANAGE_FISCAL_PERIOD',

  // General Ledger / Reports
  PERM_VIEW_TRIAL_BALANCE = 'PERM_VIEW_TRIAL_BALANCE',
  PERM_VIEW_FINANCIAL_STATEMENTS = 'PERM_VIEW_FINANCIAL_STATEMENTS',
  PERM_EXPORT_REPORTS = 'PERM_EXPORT_REPORTS',

  // Budget
  PERM_VIEW_BUDGET = 'PERM_VIEW_BUDGET',
  PERM_MANAGE_BUDGET = 'PERM_MANAGE_BUDGET',
  PERM_APPROVE_BUDGET = 'PERM_APPROVE_BUDGET',

  // Payments & Receipts
  PERM_VIEW_PAYMENT = 'PERM_VIEW_PAYMENT',
  PERM_CREATE_PAYMENT = 'PERM_CREATE_PAYMENT',
  PERM_APPROVE_PAYMENT = 'PERM_APPROVE_PAYMENT',
  PERM_VIEW_RECEIPT = 'PERM_VIEW_RECEIPT',
  PERM_CREATE_RECEIPT = 'PERM_CREATE_RECEIPT',

  // Commitments
  PERM_VIEW_COMMITMENT = 'PERM_VIEW_COMMITMENT',
  PERM_CREATE_COMMITMENT = 'PERM_CREATE_COMMITMENT',
  PERM_APPROVE_COMMITMENT = 'PERM_APPROVE_COMMITMENT',
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
