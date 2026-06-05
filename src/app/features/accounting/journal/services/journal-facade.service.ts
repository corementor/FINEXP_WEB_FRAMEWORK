import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoggerService } from '@app/core/services/logger.service';
import {
  JournalEntry,
  CreateJournalEntryRequest,
  FiscalPeriod,
  ChartOfAccount,
  validateJournalEntry,
} from '@app/core/models/journal.models';
import {
  MOCK_JOURNAL_ENTRIES,
  FISCAL_PERIODS,
  CHART_OF_ACCOUNTS,
} from '../data/mock-data';

// Module-level mutable stores (simulate a database)
let store: JournalEntry[] = [...MOCK_JOURNAL_ENTRIES];
let coaStore: ChartOfAccount[] = [...CHART_OF_ACCOUNTS];
let refCounter = MOCK_JOURNAL_ENTRIES.length + 1;

function nextRef(): string {
  const n = String(refCounter++).padStart(4, '0');
  return `JE-2026-${n}`;
}

function now(): string {
  return new Date().toISOString();
}

@Injectable({ providedIn: 'root' })
export class JournalFacadeService {
  private readonly logger = inject(LoggerService);

  // ── Chart of Accounts ─────────────────────────────────────────────────────

  /** Returns only ACTIVE accounts — safe for journal line selection */
  getChartOfAccounts(): Observable<ChartOfAccount[]> {
    return of(coaStore.filter((a) => a.status === 'ACTIVE')).pipe(delay(100));
  }

  /** Returns ALL accounts including INACTIVE — for the CoA management page */
  getAllAccounts(): Observable<ChartOfAccount[]> {
    return of([...coaStore]).pipe(delay(200));
  }

  getAccountByCode(code: string): Observable<ChartOfAccount> {
    const acc = coaStore.find((a) => a.code === code);
    if (!acc) return throwError(() => new Error(`Account ${code} not found`));
    return of({ ...acc }).pipe(delay(100));
  }

  createAccount(
    payload: Omit<ChartOfAccount, 'createdAt' | 'updatedAt'>,
  ): Observable<ChartOfAccount> {
    if (coaStore.find((a) => a.code === payload.code)) {
      return throwError(() => new Error(`Account code ${payload.code} already exists`));
    }
    const account: ChartOfAccount = { ...payload, createdAt: now(), updatedAt: now() };
    coaStore = [...coaStore, account].sort((a, b) => a.code.localeCompare(b.code));
    this.logger.info('CoA: account created', { code: account.code });
    return of({ ...account }).pipe(delay(300));
  }

  updateAccount(
    code: string,
    payload: Partial<Omit<ChartOfAccount, 'code' | 'createdAt'>>,
  ): Observable<ChartOfAccount> {
    const existing = coaStore.find((a) => a.code === code);
    if (!existing) return throwError(() => new Error(`Account ${code} not found`));
    const updated: ChartOfAccount = { ...existing, ...payload, updatedAt: now() };
    coaStore = coaStore.map((a) => (a.code === code ? updated : a));
    this.logger.info('CoA: account updated', { code });
    return of({ ...updated }).pipe(delay(300));
  }

  /**
   * Deactivate an account — never hard-delete.
   * Accounts used in posted journal lines must remain for audit trail integrity.
   */
  deactivateAccount(code: string): Observable<ChartOfAccount> {
    return this.updateAccount(code, { status: 'INACTIVE' });
  }

  reactivateAccount(code: string): Observable<ChartOfAccount> {
    return this.updateAccount(code, { status: 'ACTIVE' });
  }

  // ── Fiscal Periods ────────────────────────────────────────────────────────

  getFiscalPeriods(): Observable<FiscalPeriod[]> {
    return of([...FISCAL_PERIODS]).pipe(delay(100));
  }

  // ── Journal Entries ───────────────────────────────────────────────────────

  getAll(): Observable<JournalEntry[]> {
    this.logger.info('Journal: getAll', { count: store.length });
    return of([...store]).pipe(delay(400));
  }

  getById(id: string): Observable<JournalEntry> {
    const entry = store.find((e) => e.id === id);
    if (!entry) return throwError(() => new Error(`Entry ${id} not found`));
    return of({ ...entry }).pipe(delay(150));
  }

  create(payload: CreateJournalEntryRequest): Observable<JournalEntry> {
    const period = FISCAL_PERIODS.find((p) => p.id === payload.fiscalPeriodId);
    if (!period) return throwError(() => new Error('Invalid fiscal period'));

    const validation = validateJournalEntry(payload.lines, period, payload.entryDate);
    if (!validation.valid) {
      return throwError(() => new Error(validation.errors.join(' | ')));
    }

    const id = `je-${String(Date.now()).slice(-6)}`;
    const entry: JournalEntry = {
      id,
      referenceNumber: nextRef(),
      fiscalPeriodId: payload.fiscalPeriodId,
      fiscalPeriodName: period.name,
      entryDate: payload.entryDate,
      entryType: payload.entryType,
      description: payload.description,
      tags: payload.tags,
      lines: payload.lines.map((l, i) => ({ ...l, id: `${id}-l${i + 1}` })),
      status: 'DRAFT',
      createdAt: now(),
      updatedAt: now(),
      version: 1,
    };

    store = [entry, ...store];
    this.logger.info('Journal: created', { id, ref: entry.referenceNumber });
    return of({ ...entry }).pipe(delay(400));
  }

  update(id: string, payload: Partial<CreateJournalEntryRequest>): Observable<JournalEntry> {
    const existing = store.find((e) => e.id === id);
    if (!existing) return throwError(() => new Error(`Entry ${id} not found`));

    if (existing.status !== 'DRAFT') {
      return throwError(() => new Error('Only DRAFT entries can be edited. Create a reversal to correct a posted entry.'));
    }

    if (payload.lines) {
      const periodId = payload.fiscalPeriodId ?? existing.fiscalPeriodId;
      const period = FISCAL_PERIODS.find((p) => p.id === periodId);
      if (!period) return throwError(() => new Error('Invalid fiscal period'));

      const validation = validateJournalEntry(
        payload.lines,
        period,
        payload.entryDate ?? existing.entryDate,
      );
      if (!validation.valid) {
        return throwError(() => new Error(validation.errors.join(' | ')));
      }
    }

    const updated: JournalEntry = {
      ...existing,
      ...payload,
      lines: payload.lines
        ? payload.lines.map((l, i) => ({ ...l, id: `${id}-l${i + 1}` }))
        : existing.lines,
      updatedAt: now(),
      version: existing.version + 1,
    };

    store = store.map((e) => (e.id === id ? updated : e));
    this.logger.info('Journal: updated', { id });
    return of({ ...updated }).pipe(delay(350));
  }

  post(id: string): Observable<JournalEntry> {
    const existing = store.find((e) => e.id === id);
    if (!existing) return throwError(() => new Error(`Entry ${id} not found`));
    if (existing.status !== 'DRAFT') {
      return throwError(() => new Error(`Entry is already ${existing.status} and cannot be posted again.`));
    }

    const period = FISCAL_PERIODS.find((p) => p.id === existing.fiscalPeriodId);
    if (!period) return throwError(() => new Error('Fiscal period not found'));

    const validation = validateJournalEntry(existing.lines, period, existing.entryDate);
    if (!validation.valid) {
      return throwError(() => new Error(validation.errors.join(' | ')));
    }

    const posted: JournalEntry = {
      ...existing,
      status: 'POSTED',
      postedAt: now(),
      postedBy: 'admin',
      updatedAt: now(),
      version: existing.version + 1,
    };

    store = store.map((e) => (e.id === id ? posted : e));
    this.logger.info('Journal: posted', { id, ref: existing.referenceNumber });
    return of({ ...posted }).pipe(delay(400));
  }

  reverse(id: string): Observable<JournalEntry> {
    const original = store.find((e) => e.id === id);
    if (!original) return throwError(() => new Error(`Entry ${id} not found`));
    if (original.status !== 'POSTED') {
      return throwError(() => new Error('Only POSTED entries can be reversed.'));
    }
    if (original.reversedById) {
      return throwError(() => new Error('This entry has already been reversed.'));
    }

    const nextOpenPeriod = FISCAL_PERIODS.find((p) => !p.closed);
    if (!nextOpenPeriod) {
      return throwError(() => new Error('No open fiscal period available for the reversal entry.'));
    }

    const reversalId = `je-rev-${String(Date.now()).slice(-6)}`;
    const reversalEntry: JournalEntry = {
      id: reversalId,
      referenceNumber: nextRef(),
      fiscalPeriodId: nextOpenPeriod.id,
      fiscalPeriodName: nextOpenPeriod.name,
      entryDate: nextOpenPeriod.startDate,
      entryType: 'REVERSING',
      description: `REVERSAL of ${original.referenceNumber} — ${original.description}`,
      tags: ['reversal', ...original.tags],
      lines: original.lines.map((l, i) => ({
        ...l,
        id: `${reversalId}-l${i + 1}`,
        drCr: l.drCr === 'DR' ? 'CR' : 'DR',
      })),
      status: 'DRAFT',
      reversalOfId: original.id,
      createdAt: now(),
      updatedAt: now(),
      version: 1,
    };

    const reversedOriginal: JournalEntry = {
      ...original,
      status: 'REVERSED',
      reversedById: reversalId,
      updatedAt: now(),
      version: original.version + 1,
    };

    store = [reversalEntry, ...store.map((e) => (e.id === id ? reversedOriginal : e))];
    this.logger.info('Journal: reversed', { originalId: id, reversalId });
    return of({ ...reversalEntry }).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    const existing = store.find((e) => e.id === id);
    if (!existing) return throwError(() => new Error(`Entry ${id} not found`));
    if (existing.status !== 'DRAFT') {
      return throwError(() => new Error('Only DRAFT entries can be deleted. Posted entries must be reversed.'));
    }

    store = store.filter((e) => e.id !== id);
    this.logger.info('Journal: deleted', { id });
    return of(undefined).pipe(delay(300));
  }
}
