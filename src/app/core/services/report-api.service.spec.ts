import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

import { ReportApiService } from './report-api.service';
import { ApiConfigService } from './api-config.service';

describe('ReportApiService', () => {
  let service: ReportApiService;
  let httpMock: HttpTestingController;
  let apiConfig: ApiConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ReportApiService);
    httpMock = TestBed.inject(HttpTestingController);
    apiConfig = TestBed.inject(ApiConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request the employee report with the format and take the file name from the headers', () => {
    let fileName: string | undefined;

    service.getEmployeeReport('XLSX', false).subscribe((report) => {
      fileName = report.fileName;
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${apiConfig.reportsEndpoint}/employees`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('format')).toBe('XLSX');
    expect(req.request.params.get('activeOnly')).toBe('false');
    expect(req.request.responseType).toBe('blob');

    req.flush(new Blob(['x']), {
      headers: { 'content-disposition': 'form-data; name="attachment"; filename="employee_report.xlsx"' },
    });

    expect(fileName).toBe('employee_report.xlsx');
  });

  it('should send one ids parameter per selected employee', () => {
    service.getEmployeeReport('PDF', false, ['id-1', 'id-2']).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${apiConfig.reportsEndpoint}/employees`);
    expect(req.request.params.getAll('ids')).toEqual(['id-1', 'id-2']);

    req.flush(new Blob(['x']));
  });

  it('should fall back to a generated file name when the header is missing', () => {
    let fileName: string | undefined;

    service.getEmployeeReport().subscribe((report) => {
      fileName = report.fileName;
    });

    httpMock.expectOne((r) => r.url === `${apiConfig.reportsEndpoint}/employees`).flush(new Blob(['x']));

    expect(fileName).toBe('employee_report.pdf');
  });

  it('should post the descriptor to the generic generation endpoint', () => {
    service.generateReport({ templateName: 'balance_sheet', fileName: 'balance_sheet' }).subscribe();

    const req = httpMock.expectOne(`${apiConfig.reportsEndpoint}/generate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      templateName: 'balance_sheet',
      fileName: 'balance_sheet',
      format: 'PDF',
    });

    req.flush(new Blob(['x']));
  });
});
