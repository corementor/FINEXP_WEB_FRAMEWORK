import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response, DummyEmployee, EntityRevisionInfo } from '../models/finxp.models';

@Injectable({
  providedIn: 'root',
})
export class FinxpService {
  private baseUrl = process.env['API_URL'];

  constructor(private http: HttpClient) {}

  // Employees
  getEmployees(): Observable<Response<DummyEmployee[]>> {
    return this.http.get<Response<DummyEmployee[]>>(`${this.baseUrl}/employees`);
  }

  getEmployeeById(id: string): Observable<Response<DummyEmployee>> {
    return this.http.get<Response<DummyEmployee>>(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(employee: Partial<DummyEmployee>): Observable<Response<DummyEmployee>> {
    return this.http.post<Response<DummyEmployee>>(`${this.baseUrl}/employees`, employee);
  }

  updateEmployee(
    id: string,
    employee: Partial<DummyEmployee>,
  ): Observable<Response<DummyEmployee>> {
    return this.http.put<Response<DummyEmployee>>(`${this.baseUrl}/employees/${id}`, employee);
  }

  activateEmployee(id: string): Observable<Response<DummyEmployee>> {
    return this.http.post<Response<DummyEmployee>>(`${this.baseUrl}/employees/${id}/activate`, {});
  }

  deactivateEmployee(id: string, comments?: string): Observable<Response<DummyEmployee>> {
    return this.http.post<Response<DummyEmployee>>(
      `${this.baseUrl}/employees/${id}/deactivate`,
      comments,
    );
  }

  // Audit Trail
  getAuditTrail(): Observable<Response<EntityRevisionInfo[]>> {
    return this.http.get<Response<EntityRevisionInfo[]>>(`${this.baseUrl}/audit`);
  }

  getEmployeeAuditTrail(id: string): Observable<Response<EntityRevisionInfo[]>> {
    return this.http.get<Response<EntityRevisionInfo[]>>(`${this.baseUrl}/audit/employee/${id}`);
  }

  // Dashboard
  getDashboardStats(): Observable<Response<any>> {
    return this.http.get<Response<any>>(`${this.baseUrl}/dashboard/stats`);
  }
}
