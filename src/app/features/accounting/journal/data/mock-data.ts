import { ChartOfAccount, FiscalPeriod, JournalEntry } from '@app/core/models/journal.models';

const D = '2026-01-01T00:00:00Z';

// ── Chart of Accounts ───────────────────────────────────────────────────────
export const CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  // ASSETS (1xxx)
  { code: '1000', name: 'Current Assets',               type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Header: short-term assets',                    createdAt: D, updatedAt: D },
  { code: '1001', name: 'Cash & Bank',                  type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Cash on hand and bank balances',               parentCode: '1000', createdAt: D, updatedAt: D },
  { code: '1100', name: 'Accounts Receivable',          type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Amounts owed by customers',                    parentCode: '1000', createdAt: D, updatedAt: D },
  { code: '1200', name: 'Prepaid Expenses',             type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Expenses paid in advance',                     parentCode: '1000', createdAt: D, updatedAt: D },
  { code: '1300', name: 'Inventory',                    type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Goods held for sale',                          parentCode: '1000', createdAt: D, updatedAt: D },
  { code: '1400', name: 'Non-Current Assets',           type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Header: long-term assets',                     createdAt: D, updatedAt: D },
  { code: '1500', name: 'Property, Plant & Equipment',  type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Tangible long-term assets',                    parentCode: '1400', createdAt: D, updatedAt: D },
  { code: '1510', name: 'Accumulated Depreciation',     type: 'ASSET',     normalBalance: 'CR', status: 'ACTIVE',   description: 'Contra-asset: accumulated depreciation',       parentCode: '1500', isContra: true, createdAt: D, updatedAt: D },
  { code: '1600', name: 'Intangible Assets',            type: 'ASSET',     normalBalance: 'DR', status: 'ACTIVE',   description: 'Patents, trademarks, goodwill',                parentCode: '1400', createdAt: D, updatedAt: D },

  // LIABILITIES (2xxx)
  { code: '2000', name: 'Current Liabilities',          type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Header: short-term obligations',               createdAt: D, updatedAt: D },
  { code: '2001', name: 'Accounts Payable',             type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Amounts owed to suppliers',                    parentCode: '2000', createdAt: D, updatedAt: D },
  { code: '2100', name: 'Salaries Payable',             type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Accrued but unpaid salaries',                  parentCode: '2000', createdAt: D, updatedAt: D },
  { code: '2200', name: 'Tax Payable',                  type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Taxes owed to government',                     parentCode: '2000', createdAt: D, updatedAt: D },
  { code: '2300', name: 'Accrued Liabilities',          type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Expenses incurred but not yet paid',           parentCode: '2000', createdAt: D, updatedAt: D },
  { code: '2400', name: 'Non-Current Liabilities',      type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Header: long-term obligations',                createdAt: D, updatedAt: D },
  { code: '2500', name: 'Loans Payable',                type: 'LIABILITY', normalBalance: 'CR', status: 'ACTIVE',   description: 'Long-term borrowings',                         parentCode: '2400', createdAt: D, updatedAt: D },

  // EQUITY (3xxx)
  { code: '3000', name: 'Equity',                       type: 'EQUITY',    normalBalance: 'CR', status: 'ACTIVE',   description: 'Header: owners equity',                        createdAt: D, updatedAt: D },
  { code: '3001', name: 'Share Capital',                type: 'EQUITY',    normalBalance: 'CR', status: 'ACTIVE',   description: 'Paid-in capital from shareholders',            parentCode: '3000', createdAt: D, updatedAt: D },
  { code: '3100', name: 'Retained Earnings',            type: 'EQUITY',    normalBalance: 'CR', status: 'ACTIVE',   description: 'Accumulated profits retained in business',     parentCode: '3000', createdAt: D, updatedAt: D },
  { code: '3200', name: 'Income Summary',               type: 'EQUITY',    normalBalance: 'CR', status: 'ACTIVE',   description: 'Temporary closing account',                    parentCode: '3000', createdAt: D, updatedAt: D },

  // REVENUE (4xxx)
  { code: '4000', name: 'Revenue',                      type: 'REVENUE',   normalBalance: 'CR', status: 'ACTIVE',   description: 'Header: income accounts',                      createdAt: D, updatedAt: D },
  { code: '4001', name: 'Consulting Revenue',           type: 'REVENUE',   normalBalance: 'CR', status: 'ACTIVE',   description: 'Revenue from consulting services',             parentCode: '4000', createdAt: D, updatedAt: D },
  { code: '4002', name: 'Service Revenue',              type: 'REVENUE',   normalBalance: 'CR', status: 'ACTIVE',   description: 'Revenue from general services',                parentCode: '4000', createdAt: D, updatedAt: D },
  { code: '4100', name: 'Interest Income',              type: 'REVENUE',   normalBalance: 'CR', status: 'ACTIVE',   description: 'Interest earned on deposits',                  parentCode: '4000', createdAt: D, updatedAt: D },
  { code: '4900', name: 'Sales Returns & Allowances',   type: 'REVENUE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Contra-revenue: returns and discounts',        parentCode: '4000', isContra: true, createdAt: D, updatedAt: D },

  // EXPENSES (5xxx)
  { code: '5000', name: 'Operating Expenses',           type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Header: operating cost accounts',              createdAt: D, updatedAt: D },
  { code: '5001', name: 'Salaries Expense',             type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Employee salaries and wages',                  parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5100', name: 'Rent Expense',                 type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Office and facility rent',                     parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5200', name: 'Utilities Expense',            type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Electricity, water, internet',                 parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5300', name: 'Depreciation Expense',         type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Periodic depreciation charge',                 parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5400', name: 'Office Supplies Expense',      type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Stationery and consumables',                   parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5500', name: 'Travel & Entertainment',       type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Business travel and client entertainment',     parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5600', name: 'Insurance Expense',            type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Business insurance premiums',                  parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5700', name: 'Interest Expense',             type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Interest on loans and borrowings',             parentCode: '5000', createdAt: D, updatedAt: D },
  { code: '5800', name: 'Tax Expense',                  type: 'EXPENSE',   normalBalance: 'DR', status: 'ACTIVE',   description: 'Income tax expense',                           parentCode: '5000', createdAt: D, updatedAt: D },
];

// ── Fiscal Periods ──────────────────────────────────────────────────────────
export const FISCAL_PERIODS: FiscalPeriod[] = [
  { id: 'fp-2025-11', name: 'November 2025',  startDate: '2025-11-01', endDate: '2025-11-30', closed: true  },
  { id: 'fp-2025-12', name: 'December 2025',  startDate: '2025-12-01', endDate: '2025-12-31', closed: true  },
  { id: 'fp-2026-01', name: 'January 2026',   startDate: '2026-01-01', endDate: '2026-01-31', closed: true  },
  { id: 'fp-2026-02', name: 'February 2026',  startDate: '2026-02-01', endDate: '2026-02-28', closed: true  },
  { id: 'fp-2026-03', name: 'March 2026',     startDate: '2026-03-01', endDate: '2026-03-31', closed: false },
  { id: 'fp-2026-04', name: 'April 2026',     startDate: '2026-04-01', endDate: '2026-04-30', closed: false },
  { id: 'fp-2026-05', name: 'May 2026',       startDate: '2026-05-01', endDate: '2026-05-31', closed: false },
];

// ── Mock Journal Entries ────────────────────────────────────────────────────
// Each line has ONE amount and ONE side (DR or CR). Never both.
// Total DR must equal Total CR within each entry.
export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  // ── JE-2026-0001: Payroll January ──────────────────────────────────────
  // Record salary expense and liability
  {
    id: 'je-001',
    referenceNumber: 'JE-2026-0001',
    fiscalPeriodId: 'fp-2026-01',
    fiscalPeriodName: 'January 2026',
    entryDate: '2026-01-31',
    entryType: 'GENERAL',
    description: 'Payroll accrual — January 2026 salaries',
    tags: ['payroll', 'accrual', 'january'],
    status: 'POSTED',
    postedAt: '2026-01-31T17:00:00Z',
    postedBy: 'admin',
    createdAt: '2026-01-31T16:00:00Z',
    updatedAt: '2026-01-31T17:00:00Z',
    version: 2,
    lines: [
      { id: 'l-001-1', accountCode: '5001', accountName: 'Salaries Expense',  accountType: 'EXPENSE',   drCr: 'DR', amount: 4500000 },
      { id: 'l-001-2', accountCode: '2100', accountName: 'Salaries Payable',  accountType: 'LIABILITY', drCr: 'CR', amount: 4500000 },
    ],
  },

  // ── JE-2026-0002: Payroll Payment January ──────────────────────────────
  // Settle the salary liability with cash
  {
    id: 'je-002',
    referenceNumber: 'JE-2026-0002',
    fiscalPeriodId: 'fp-2026-01',
    fiscalPeriodName: 'January 2026',
    entryDate: '2026-01-31',
    entryType: 'GENERAL',
    description: 'Payroll disbursement — January 2026 salaries paid',
    tags: ['payroll', 'payment', 'january'],
    status: 'POSTED',
    postedAt: '2026-01-31T18:00:00Z',
    postedBy: 'admin',
    createdAt: '2026-01-31T17:30:00Z',
    updatedAt: '2026-01-31T18:00:00Z',
    version: 1,
    lines: [
      { id: 'l-002-1', accountCode: '2100', accountName: 'Salaries Payable', accountType: 'LIABILITY', drCr: 'DR', amount: 4500000 },
      { id: 'l-002-2', accountCode: '1001', accountName: 'Cash & Bank',      accountType: 'ASSET',     drCr: 'CR', amount: 4500000 },
    ],
  },

  // ── JE-2026-0003: Revenue Recognition ──────────────────────────────────
  // Consulting services rendered, invoice raised
  {
    id: 'je-003',
    referenceNumber: 'JE-2026-0003',
    fiscalPeriodId: 'fp-2026-02',
    fiscalPeriodName: 'February 2026',
    entryDate: '2026-02-14',
    entryType: 'GENERAL',
    description: 'Revenue recognition — consulting services rendered to Client A',
    tags: ['revenue', 'consulting', 'february'],
    status: 'POSTED',
    postedAt: '2026-02-14T12:00:00Z',
    postedBy: 'admin',
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-02-14T12:00:00Z',
    version: 1,
    lines: [
      { id: 'l-003-1', accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'ASSET',   drCr: 'DR', amount: 2800000 },
      { id: 'l-003-2', accountCode: '4001', accountName: 'Consulting Revenue',  accountType: 'REVENUE', drCr: 'CR', amount: 2800000 },
    ],
  },

  // ── JE-2026-0004: Depreciation Adjustment ──────────────────────────────
  // Monthly depreciation on PPE
  {
    id: 'je-004',
    referenceNumber: 'JE-2026-0004',
    fiscalPeriodId: 'fp-2026-02',
    fiscalPeriodName: 'February 2026',
    entryDate: '2026-02-28',
    entryType: 'ADJUSTMENT',
    description: 'Monthly depreciation — vehicles and equipment February 2026',
    tags: ['depreciation', 'adjustment', 'february'],
    status: 'POSTED',
    postedAt: '2026-02-28T23:00:00Z',
    postedBy: 'admin',
    createdAt: '2026-02-28T22:00:00Z',
    updatedAt: '2026-02-28T23:00:00Z',
    version: 1,
    lines: [
      { id: 'l-004-1', accountCode: '5300', accountName: 'Depreciation Expense',   accountType: 'EXPENSE', drCr: 'DR', amount: 320000 },
      { id: 'l-004-2', accountCode: '1510', accountName: 'Accumulated Depreciation', accountType: 'ASSET', drCr: 'CR', amount: 320000 },
    ],
  },

  // ── JE-2026-0005: Prepaid Insurance ────────────────────────────────────
  // Pay annual insurance premium upfront, record as prepaid asset
  {
    id: 'je-005',
    referenceNumber: 'JE-2026-0005',
    fiscalPeriodId: 'fp-2026-03',
    fiscalPeriodName: 'March 2026',
    entryDate: '2026-03-01',
    entryType: 'GENERAL',
    description: 'Annual insurance premium paid — recorded as prepaid asset',
    tags: ['insurance', 'prepaid', 'march'],
    status: 'POSTED',
    postedAt: '2026-03-01T10:00:00Z',
    postedBy: 'admin',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    version: 1,
    lines: [
      { id: 'l-005-1', accountCode: '1200', accountName: 'Prepaid Expenses', accountType: 'ASSET',   drCr: 'DR', amount: 600000 },
      { id: 'l-005-2', accountCode: '1001', accountName: 'Cash & Bank',      accountType: 'ASSET',   drCr: 'CR', amount: 600000 },
    ],
  },

  // ── JE-2026-0006: Insurance Expense Recognition (monthly amortisation) ─
  // Recognise 1 month of prepaid insurance as expense
  {
    id: 'je-006',
    referenceNumber: 'JE-2026-0006',
    fiscalPeriodId: 'fp-2026-03',
    fiscalPeriodName: 'March 2026',
    entryDate: '2026-03-31',
    entryType: 'ADJUSTMENT',
    description: 'Insurance expense recognition — March 2026 (1/12 of annual premium)',
    tags: ['insurance', 'adjustment', 'march'],
    status: 'POSTED',
    postedAt: '2026-03-31T23:00:00Z',
    postedBy: 'admin',
    createdAt: '2026-03-31T22:00:00Z',
    updatedAt: '2026-03-31T23:00:00Z',
    version: 1,
    lines: [
      { id: 'l-006-1', accountCode: '5600', accountName: 'Insurance Expense', accountType: 'EXPENSE', drCr: 'DR', amount: 50000 },
      { id: 'l-006-2', accountCode: '1200', accountName: 'Prepaid Expenses',  accountType: 'ASSET',   drCr: 'CR', amount: 50000 },
    ],
  },

  // ── JE-2026-0007: Utilities Accrual ────────────────────────────────────
  // Accrue utilities expense not yet invoiced
  {
    id: 'je-007',
    referenceNumber: 'JE-2026-0007',
    fiscalPeriodId: 'fp-2026-04',
    fiscalPeriodName: 'April 2026',
    entryDate: '2026-04-30',
    entryType: 'ADJUSTMENT',
    description: 'Utilities accrual — electricity and water April 2026 (invoice pending)',
    tags: ['utilities', 'accrual', 'april'],
    status: 'DRAFT',
    createdAt: '2026-04-30T20:00:00Z',
    updatedAt: '2026-04-30T20:00:00Z',
    version: 1,
    lines: [
      { id: 'l-007-1', accountCode: '5200', accountName: 'Utilities Expense',   accountType: 'EXPENSE',   drCr: 'DR', amount: 87500 },
      { id: 'l-007-2', accountCode: '2300', accountName: 'Accrued Liabilities', accountType: 'LIABILITY', drCr: 'CR', amount: 87500 },
    ],
  },

  // ── JE-2026-0008: Loan Interest Accrual ────────────────────────────────
  // Accrue interest on outstanding loan
  {
    id: 'je-008',
    referenceNumber: 'JE-2026-0008',
    fiscalPeriodId: 'fp-2026-04',
    fiscalPeriodName: 'April 2026',
    entryDate: '2026-04-30',
    entryType: 'ADJUSTMENT',
    description: 'Loan interest accrual — April 2026 (18% p.a. on RWF 10,000,000)',
    tags: ['interest', 'loan', 'accrual', 'april'],
    status: 'DRAFT',
    createdAt: '2026-04-30T21:00:00Z',
    updatedAt: '2026-04-30T21:00:00Z',
    version: 1,
    lines: [
      { id: 'l-008-1', accountCode: '5700', accountName: 'Interest Expense',   accountType: 'EXPENSE',   drCr: 'DR', amount: 150000 },
      { id: 'l-008-2', accountCode: '2300', accountName: 'Accrued Liabilities', accountType: 'LIABILITY', drCr: 'CR', amount: 150000 },
    ],
  },

  // ── JE-2026-0009: Reversal of Utilities Accrual ────────────────────────
  // Auto-reversal of JE-2026-0007 at start of May (actual invoice will replace it)
  {
    id: 'je-009',
    referenceNumber: 'JE-2026-0009',
    fiscalPeriodId: 'fp-2026-05',
    fiscalPeriodName: 'May 2026',
    entryDate: '2026-05-01',
    entryType: 'REVERSING',
    description: 'REVERSAL of JE-2026-0007 — utilities accrual April 2026',
    tags: ['reversal', 'utilities', 'may'],
    status: 'DRAFT',
    reversalOfId: 'je-007',
    createdAt: '2026-05-01T00:01:00Z',
    updatedAt: '2026-05-01T00:01:00Z',
    version: 1,
    // Lines are the exact mirror of JE-007 (DR↔CR swapped)
    lines: [
      { id: 'l-009-1', accountCode: '2300', accountName: 'Accrued Liabilities', accountType: 'LIABILITY', drCr: 'DR', amount: 87500 },
      { id: 'l-009-2', accountCode: '5200', accountName: 'Utilities Expense',   accountType: 'EXPENSE',   drCr: 'CR', amount: 87500 },
    ],
  },

  // ── JE-2026-0010: Office Supplies ──────────────────────────────────────
  // Purchase office supplies on credit
  {
    id: 'je-010',
    referenceNumber: 'JE-2026-0010',
    fiscalPeriodId: 'fp-2026-05',
    fiscalPeriodName: 'May 2026',
    entryDate: '2026-05-10',
    entryType: 'GENERAL',
    description: 'Office supplies purchased on credit — Q2 stationery order',
    tags: ['supplies', 'Q2', 'may'],
    status: 'DRAFT',
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
    version: 1,
    lines: [
      { id: 'l-010-1', accountCode: '5400', accountName: 'Office Supplies Expense', accountType: 'EXPENSE',   drCr: 'DR', amount: 125000 },
      { id: 'l-010-2', accountCode: '2001', accountName: 'Accounts Payable',        accountType: 'LIABILITY', drCr: 'CR', amount: 125000 },
    ],
  },
];
