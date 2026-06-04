import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * API Configuration Service
 * Centralized configuration for all API endpoints
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  readonly baseUrl = environment.apiUrl;
  readonly authUrl = environment.authUrl;
  readonly httpTimeout = environment.httpTimeout;

  get employeeEndpoint(): string {
    return `${this.baseUrl}/employees`;
  }

  get auditEndpoint(): string {
    return `${this.baseUrl}/audit`;
  }

  get dashboardEndpoint(): string {
    return `${this.baseUrl}/dashboard`;
  }

  get authEndpoint(): string {
    return `${this.authUrl}/login`;
  }

  get logoutEndpoint(): string {
    return `${this.authUrl}/logout`;
  }

  get refreshTokenEndpoint(): string {
    return `${this.authUrl}/refresh`;
  }

  // ── Accounting / Finance endpoints ──────────────────────────────────────────

  get journalEndpoint(): string {
    return `${this.baseUrl}/journal-entries`;
  }

  get chartOfAccountsEndpoint(): string {
    return `${this.baseUrl}/chart-of-accounts`;
  }

  get fiscalPeriodsEndpoint(): string {
    return `${this.baseUrl}/fiscal-periods`;
  }

  get trialBalanceEndpoint(): string {
    return `${this.baseUrl}/reports/trial-balance`;
  }

  get financialStatementsEndpoint(): string {
    return `${this.baseUrl}/reports/financial-statements`;
  }

  get budgetEndpoint(): string {
    return `${this.baseUrl}/budget`;
  }

  get paymentsEndpoint(): string {
    return `${this.baseUrl}/payments`;
  }

  get receiptsEndpoint(): string {
    return `${this.baseUrl}/receipts`;
  }

  get commitmentsEndpoint(): string {
    return `${this.baseUrl}/commitments`;
  }
}
