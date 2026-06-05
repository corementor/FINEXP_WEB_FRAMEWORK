import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { LoggerService } from '@app/core/services/logger.service';
import { JournalFacadeService } from '../journal/services/journal-facade.service';
import { computeTrialBalance, TrialBalance, TrialBalanceSection } from './trial-balance.models';
import { FiscalPeriod, ChartOfAccount, JournalEntry } from '@app/core/models/journal.models';

@Injectable({ providedIn: 'root' })
export class TrialBalanceApiService {
  private readonly facade = inject(JournalFacadeService);
  private readonly logger = inject(LoggerService);

  getPeriods(): Observable<FiscalPeriod[]> {
    return this.facade.getFiscalPeriods();
  }

  getAllAccounts(): Observable<ChartOfAccount[]> {
    return this.facade.getAllAccounts();
  }

  getAllJournalEntries(): Observable<JournalEntry[]> {
    return this.facade.getAll();
  }

  generateTrialBalance(
    periodId: string,
    periods: FiscalPeriod[],
    accounts: ChartOfAccount[],
    entries: JournalEntry[],
  ): Observable<TrialBalance> {
    const period = periods.find((p) => p.id === periodId);
    if (!period) {
      return throwError(() => new Error('Invalid fiscal period selected'));
    }

    this.logger.info('TrialBalance: generating report', { periodId, periodName: period.name });

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      map(() =>
        computeTrialBalance(accounts, entries, period.endDate, period.name),
      ),
    );
  }
}