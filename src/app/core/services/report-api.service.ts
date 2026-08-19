import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfigService } from './api-config.service';
import { LoggerService } from './logger.service';

/**
 * Output formats supported by the Jasper reporting engine.
 */
export type ReportFormat = 'PDF' | 'XLSX';

/**
 * Descriptor of a generic report generation request.
 */
export interface ReportRequest {
  templateName: string;
  format?: ReportFormat;
  fileName?: string;
  parameters?: Record<string, unknown>;
  data?: unknown[];
}

/**
 * A generated document together with the file name suggested by the backend.
 */
export interface GeneratedReport {
  blob: Blob;
  fileName: string;
}

/**
 * Report API Service
 * Thin HTTP layer over the backend reporting endpoints (`/api/reports`).
 */
@Injectable({
  providedIn: 'root',
})
export class ReportApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly logger = inject(LoggerService);

  /**
   * Download the employee report.
   *
   * @param format the output format
   * @param activeOnly true to restrict the report to the active employees
   * @param ids the employees selected by the user, empty to report on all of them
   */
  getEmployeeReport(
    format: ReportFormat = 'PDF',
    activeOnly = true,
    ids: string[] = [],
  ): Observable<GeneratedReport> {
    let params = new HttpParams().set('format', format).set('activeOnly', activeOnly);
    ids.forEach((id) => (params = params.append('ids', id)));

    this.logger.debug('Requesting the employee report', { format, activeOnly, selected: ids.length });

    return this.http
      .get(`${this.apiConfig.reportsEndpoint}/employees`, {
        params,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(map((response) => this.toGeneratedReport(response, `employee_report${this.extension(format)}`)));
  }

  /**
   * Generate any report of the engine from its descriptor.
   */
  generateReport(request: ReportRequest): Observable<GeneratedReport> {
    const format = request.format ?? 'PDF';
    const fallbackName = `${request.fileName ?? request.templateName}${this.extension(format)}`;

    this.logger.debug('Requesting a report', { template: request.templateName, format });

    return this.http
      .post(
        `${this.apiConfig.reportsEndpoint}/generate`,
        { ...request, format },
        { responseType: 'blob', observe: 'response' },
      )
      .pipe(map((response) => this.toGeneratedReport(response, fallbackName)));
  }

  private toGeneratedReport(response: HttpResponse<Blob>, fallbackName: string): GeneratedReport {
    return {
      blob: response.body ?? new Blob(),
      fileName: this.resolveFileName(response.headers.get('content-disposition'), fallbackName),
    };
  }

  private resolveFileName(contentDisposition: string | null, fallbackName: string): string {
    if (!contentDisposition) {
      return fallbackName;
    }

    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(contentDisposition);
    return match?.[1] ? decodeURIComponent(match[1]) : fallbackName;
  }

  private extension(format: ReportFormat): string {
    return format === 'XLSX' ? '.xlsx' : '.pdf';
  }
}
