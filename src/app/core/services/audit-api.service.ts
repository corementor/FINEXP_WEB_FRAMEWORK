import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditEvent } from '../models/domain.models';
import { ApiResponse } from '../models/api-response.model';
import { ApiConfigService } from './api-config.service';
import { LoggerService } from './logger.service';

/**
 * Audit API Service - Communication layer with backend
 * Handles all HTTP calls for audit trail operations
 */
@Injectable({
  providedIn: 'root',
})
export class AuditApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);
  private readonly logger = inject(LoggerService);

  /**
   * Get audit events with optional filtering
   */
  getAuditEvents(
    skip?: number,
    take?: number,
    userId?: string,
    operation?: string,
  ): Observable<ApiResponse<AuditEvent[]>> {
    this.logger.debug('Fetching audit events', { skip, take, userId, operation });

    let params = new HttpParams();
    if (skip !== undefined) params = params.set('skip', skip.toString());
    if (take !== undefined) params = params.set('take', take.toString());
    if (userId) params = params.set('userId', userId);
    if (operation) params = params.set('operation', operation);

    return this.http.get<ApiResponse<AuditEvent[]>>(this.config.auditEndpoint, { params });
  }

  /**
   * Get audit event by ID
   */
  getAuditEventById(id: string): Observable<ApiResponse<AuditEvent>> {
    this.logger.debug('Fetching audit event', { id });
    return this.http.get<ApiResponse<AuditEvent>>(`${this.config.auditEndpoint}/${id}`);
  }

  /**
   * Get audit events for a specific employee
   */
  getEmployeeAuditTrail(employeeId: string, skip?: number, take?: number): Observable<ApiResponse<any[]>> {
    this.logger.debug('Fetching employee audit trail', { employeeId, skip, take });

    let params = new HttpParams();
    if (skip !== undefined) params = params.set('skip', skip.toString());
    if (take !== undefined) params = params.set('take', take.toString());

    return this.http.get<ApiResponse<any[]>>(`${this.config.auditEndpoint}/employee/${employeeId}`, { params });
  }

  /**
   * Export audit logs
   */
  exportAuditLogs(startDate?: string, endDate?: string, userId?: string): Observable<Blob> {
    this.logger.debug('Exporting audit logs');

    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (userId) params = params.set('userId', userId);

    return this.http.get(`${this.config.auditEndpoint}/export`, { params, responseType: 'blob' });
  }
}
