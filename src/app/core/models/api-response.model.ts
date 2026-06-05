/**
 * Generic API Response wrapper for all API endpoints
 * Ensures consistent response structure across all microservices
 */
export interface ApiResponse<T> {
  result: T;
  messages: string[];
  messageCodes: number[];
  simpleMessage?: string;
  timestamp?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Filter criteria for API requests
 */
export interface FilterCriteria {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  [key: string]: any;
}

/**
 * API Error response structure
 */
export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Result wrapper for success/error handling
 */
export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiError };
