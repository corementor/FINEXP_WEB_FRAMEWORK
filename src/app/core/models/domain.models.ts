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
  PERM_VIEW_REPORT = 'PERM_VIEW_REPORT',

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
 * Runtime health indicators exposed by GET /api/dashboard/health
 */
export interface SystemHealth {
  status: 'UP' | 'DEGRADED' | 'DOWN' | string;
  uptime: number;
  uptimeMillis: number;
  memoryUsage: number;
  cpuUsage: number;
  usedMemoryMb: number;
  maxMemoryMb: number;
  availableProcessors: number;
}

/**
 * Recent activity entry exposed by GET /api/dashboard/activity
 */
export interface DashboardActivity {
  id: number;
  actionTime: number;
  actionDate: string;
  action: string;
  description: string;
  entityId: string;
  entityType: string;
  entityName: string;
  entityNumber?: string;
  email?: string;
  state: string;
  userId?: string;
}

/**
 * Aggregated counters exposed by GET /api/dashboard/stats
 */
export interface DashboardCounters {
  totalEntities: number;
  activeEntities: number;
  pendingEntities: number;
  inactiveEntities: number;
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalPermissions: number;
}

/**
 * Raw payload exposed by GET /api/dashboard/summary
 */
export interface DashboardSummary {
  stats: DashboardCounters;
  recentActivity: DashboardActivity[];
  entitiesByState: Record<string, number>;
  systemHealth: SystemHealth;
  generatedAt: number;
}

/**
 * Dashboard statistics as consumed by the dashboard view
 */
export interface DashboardStats {
  totalEntities: number;
  activeEntities: number;
  createdEntities: number;
  inactiveEntities: number;
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalPermissions: number;
  entitiesByState: Record<string, number>;
  recentActivity: DashboardActivity[];
  systemHealth: SystemHealth;
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

/**
 * Consolidated treasury position of the finance dashboard
 */
export interface CashPosition {
  label: string;
  totalCash: number;
  changePercent: number;
  increase: boolean;
  comparedToLastMonth: number;
  currency: string;
}

/**
 * One key performance indicator tile of the finance dashboard
 */
export interface FinanceKpi {
  key: string;
  label: string;
  value: number;
  changePercent: number;
  increase: boolean;
  comparedToLastMonth: number;
}

/**
 * Generic labelled amount used by the chart legends and the doughnut chart
 */
export interface FinanceSlice {
  title: string;
  value: number;
  color: string;
}

/**
 * Revenue, expenses and budget series of a single aggregation period
 */
export interface FinanceOverviewPeriod {
  key: string;
  label: string;
  labels: string[];
  revenue: number[];
  expenses: number[];
  budget: number[];
}

/**
 * Revenue versus expenses versus budget chart
 */
export interface FinanceOverview {
  selectedPeriod: string;
  periods: FinanceOverviewPeriod[];
  legend: FinanceSlice[];
}

/**
 * Budget consumption of a single cost center
 */
export interface BudgetExecution {
  code: string;
  costCenter: string;
  allocated: number;
  consumed: number;
  committed: number;
  utilizationPercent: number;
}

/**
 * Split of the cash movements feeding the doughnut chart
 */
export interface CashBreakdown {
  slices: FinanceSlice[];
  total: number;
  netCashFlow: number;
}

/**
 * One recent journal entry or payment
 */
export interface FinanceEntry {
  reference: string;
  description: string;
  counterparty: string;
  amount: number;
  direction: string;
  status: string;
  date: string;
}

/**
 * Summary of the payment run waiting for approval
 */
export interface PendingApprovals {
  pendingCount: number;
  pendingAmount: number;
  nextRunDate: string;
  approvedThisMonth: number;
  rejectedThisMonth: number;
}

/**
 * Raw payload exposed by GET /api/finance-dashboard/summary
 */
export interface FinanceDashboardSummary {
  cashPosition: CashPosition;
  kpis: FinanceKpi[];
  overview: FinanceOverview;
  budgetExecution: BudgetExecution[];
  cashBreakdown: CashBreakdown;
  recentEntries: FinanceEntry[];
  pendingApprovals: PendingApprovals;
  currency: string;
  generatedAt: number;
}
