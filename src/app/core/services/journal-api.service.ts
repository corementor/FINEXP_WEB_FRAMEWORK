import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { LoggerService } from './logger.service';
import { ApiResponse } from '../models/api-response.model';
import { JournalEntry, CreateJournalEntryRequest } from '../models/journal.models';

@Injectable({ providedIn: 'root' })
export class JournalApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfigService);
  private readonly logger = inject(LoggerService);

  private get endpoint(): string {
    return `${this.config.baseUrl}/journal-entries`;
  }

  getAll(skip = 0, take = 50, search?: string): Observable<ApiResponse<JournalEntry[]>> {
    this.logger.debug('JournalApi: getAll', { skip, take, search });
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<JournalEntry[]>>(this.endpoint, { params });
  }

  getById(id: string): Observable<ApiResponse<JournalEntry>> {
    this.logger.debug('JournalApi: getById', { id });
    return this.http.get<ApiResponse<JournalEntry>>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateJournalEntryRequest): Observable<ApiResponse<JournalEntry>> {
    this.logger.debug('JournalApi: create');
    return this.http.post<ApiResponse<JournalEntry>>(this.endpoint, payload);
  }

  update(id: string, payload: Partial<CreateJournalEntryRequest>): Observable<ApiResponse<JournalEntry>> {
    this.logger.debug('JournalApi: update', { id });
    return this.http.put<ApiResponse<JournalEntry>>(`${this.endpoint}/${id}`, payload);
  }

  post(id: string): Observable<ApiResponse<JournalEntry>> {
    this.logger.debug('JournalApi: post', { id });
    return this.http.post<ApiResponse<JournalEntry>>(`${this.endpoint}/${id}/post`, {});
  }

  reverse(id: string): Observable<ApiResponse<JournalEntry>> {
    this.logger.debug('JournalApi: reverse', { id });
    return this.http.post<ApiResponse<JournalEntry>>(`${this.endpoint}/${id}/reverse`, {});
  }

  delete(id: string): Observable<ApiResponse<void>> {
    this.logger.debug('JournalApi: delete', { id });
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}
