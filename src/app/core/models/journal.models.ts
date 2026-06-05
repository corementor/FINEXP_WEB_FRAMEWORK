// ── Account types (normal balance side) ────────────────────────────────────
export type AccountType =
  | 'ASSET'        // Normal balance: DEBIT
  | 'LIABILITY'    // Normal balance: CREDIT
  | 'EQUITY'       // Normal balance: CREDIT
  | 'REVENUE'      // Normal balance: CREDIT
  | 'EXPENSE';     // Normal balance: DEBIT

export type DrCr = 'DR' | 'CR';

export type AccountStatus = 'ACTIVE' | 'INACTIVE';

// ── Chart of Accounts entry ─────────────────────────────────────────────────
export interface ChartOfAccount {
  code: string;                  // Unique account code, e.g. '1001'
  name: string;
  type: AccountType;
  normalBalance: DrCr;           // Which side increases this account
  description?: string;
  parentCode?: string;           // Parent account code for sub-accounts
  isContra?: boolean;            // Contra accounts reduce their parent type
  status: AccountStatus;         // ACTIVE accounts can be used in journal lines
  createdAt: string;
  updatedAt: string;
}

// ── Fiscal period ───────────────────────────────────────────────────────────
export interface FiscalPeriod {
  id: string;
  name: string;       // e.g. "January 2026"
  startDate: string;  // ISO date
  endDate: string;    // ISO date
  closed: boolean;
}

// ── Journal line — one amount, one side (DR or CR) ──────────────────────────
// A line NEVER has both debit and credit. It has one amount and a side.
export interface JournalLine {
  id?: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  drCr: DrCr;         // Is this line a Debit or a Credit?
  amount: number;     // Always positive
  description?: string;
}

// ── Entry types ─────────────────────────────────────────────────────────────
export type JournalEntryType = 'GENERAL' | 'ADJUSTMENT' | 'CLOSING' | 'REVERSING';

// ── Entry status lifecycle: DRAFT → POSTED (irreversible) ──────────────────
// To correct a POSTED entry you create a new REVERSING entry — you never
// edit or delete a posted entry.
export type JournalEntryStatus = 'DRAFT' | 'POSTED' | 'REVERSED';

// ── Journal entry ───────────────────────────────────────────────────────────
export interface JournalEntry {
  id: string;
  referenceNumber: string;   // System-generated, e.g. JE-2026-0001
  fiscalPeriodId: string;
  fiscalPeriodName: string;
  entryDate: string;         // ISO date within the fiscal period
  entryType: JournalEntryType;
  description: string;
  tags: string[];
  lines: JournalLine[];
  status: JournalEntryStatus;
  // Set when posted
  postedAt?: string;
  postedBy?: string;
  // Set when this entry is a reversal of another
  reversalOfId?: string;
  // Set when a reversal has been created for this entry
  reversedById?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// ── Request payload (no system fields) ─────────────────────────────────────
export interface CreateJournalEntryRequest {
  fiscalPeriodId: string;
  entryDate: string;
  entryType: JournalEntryType;
  description: string;
  tags: string[];
  lines: Omit<JournalLine, 'id'>[];
}

// ── Validation result ───────────────────────────────────────────────────────
export interface JournalValidationResult {
  valid: boolean;
  errors: string[];
}

// ── Pure accounting validation ──────────────────────────────────────────────
export function validateJournalEntry(
  lines: Pick<JournalLine, 'drCr' | 'amount'>[],
  fiscalPeriod: FiscalPeriod,
  entryDate: string,
): JournalValidationResult {
  const errors: string[] = [];

  if (lines.length < 2) {
    errors.push('A journal entry must have at least two lines.');
  }

  const totalDR = lines.filter((l) => l.drCr === 'DR').reduce((s, l) => s + l.amount, 0);
  const totalCR = lines.filter((l) => l.drCr === 'CR').reduce((s, l) => s + l.amount, 0);

  if (Math.abs(totalDR - totalCR) > 0.005) {
    errors.push(
      `Entry is not balanced. Total Debits (${totalDR.toFixed(2)}) ≠ Total Credits (${totalCR.toFixed(2)}).`,
    );
  }

  if (lines.some((l) => l.amount <= 0)) {
    errors.push('All line amounts must be greater than zero.');
  }

  if (fiscalPeriod.closed) {
    errors.push(`Fiscal period "${fiscalPeriod.name}" is closed. You cannot post to a closed period.`);
  }

  if (entryDate < fiscalPeriod.startDate || entryDate > fiscalPeriod.endDate) {
    errors.push(
      `Entry date ${entryDate} is outside the selected fiscal period (${fiscalPeriod.startDate} – ${fiscalPeriod.endDate}).`,
    );
  }

  return { valid: errors.length === 0, errors };
}
