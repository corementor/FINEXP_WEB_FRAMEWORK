import { ChartOfAccount, JournalEntry, AccountType } from '@app/core/models/journal.models';

// ── Balance sheet line ──────────────────────────────────────────────────────
export interface BalanceSheetLine {
  accountCode: string;
  accountName: string;
  balance: number;       // Always positive; sign conveyed by position in report
  isContra: boolean;
  isHeader: boolean;     // Header accounts show subtotals, not their own balance
  indent: number;        // 0 = section header, 1 = group header, 2 = account
}

// ── Balance sheet section ───────────────────────────────────────────────────
export interface BalanceSheetSection {
  title: string;
  lines: BalanceSheetLine[];
  total: number;
}

// ── Full balance sheet ──────────────────────────────────────────────────────
export interface BalanceSheet {
  asOfDate: string;
  fiscalPeriodName: string;

  // Assets
  currentAssets: BalanceSheetSection;
  nonCurrentAssets: BalanceSheetSection;
  totalAssets: number;

  // Liabilities
  currentLiabilities: BalanceSheetSection;
  nonCurrentLiabilities: BalanceSheetSection;
  totalLiabilities: number;

  // Equity
  equity: BalanceSheetSection;
  totalEquity: number;

  // The fundamental equation check
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;   // totalAssets === totalLiabilitiesAndEquity
}

// ── Account balance map ─────────────────────────────────────────────────────
// Computes the running balance for every account from POSTED journal entries
// up to and including asOfDate.
export function computeAccountBalances(
  entries: JournalEntry[],
  asOfDate: string,
): Map<string, number> {
  const balances = new Map<string, number>();

  entries
    .filter((e) => e.status === 'POSTED' && e.entryDate <= asOfDate)
    .forEach((entry) => {
      entry.lines.forEach((line) => {
        const current = balances.get(line.accountCode) ?? 0;
        // DR lines increase the DR side, CR lines increase the CR side
        // We store as signed: DR = positive, CR = negative
        const delta = line.drCr === 'DR' ? line.amount : -line.amount;
        balances.set(line.accountCode, current + delta);
      });
    });

  return balances;
}

// ── Get account balance in its natural sign ─────────────────────────────────
// Returns a positive number when the account has a normal balance,
// negative when it has an abnormal balance (e.g. overdrawn cash).
export function getAccountBalance(
  accountCode: string,
  normalBalance: 'DR' | 'CR',
  isContra: boolean,
  rawBalances: Map<string, number>,
): number {
  const raw = rawBalances.get(accountCode) ?? 0;
  // raw is DR-positive. For CR-normal accounts, flip the sign.
  const natural = normalBalance === 'DR' ? raw : -raw;
  // Contra accounts have the opposite normal balance to their type
  return isContra ? -natural : natural;
}

// ── Build the full balance sheet ────────────────────────────────────────────
export function buildBalanceSheet(
  coa: ChartOfAccount[],
  entries: JournalEntry[],
  asOfDate: string,
  fiscalPeriodName: string,
): BalanceSheet {
  const rawBalances = computeAccountBalances(entries, asOfDate);

  // Helper: get balance for an account
  const bal = (acc: ChartOfAccount) =>
    getAccountBalance(acc.code, acc.normalBalance, acc.isContra ?? false, rawBalances);

  // Helper: build lines for a set of accounts
  const buildLines = (accounts: ChartOfAccount[]): BalanceSheetLine[] =>
    accounts.map((acc) => ({
      accountCode: acc.code,
      accountName: acc.name,
      balance: bal(acc),
      isContra: acc.isContra ?? false,
      isHeader: !acc.parentCode,
      indent: acc.parentCode ? 2 : 1,
    }));

  // ── Assets ────────────────────────────────────────────────────────────────
  const currentAssetAccounts = coa.filter(
    (a) => a.type === 'ASSET' && (a.code.startsWith('1') && parseInt(a.code) < 1400),
  );
  const nonCurrentAssetAccounts = coa.filter(
    (a) => a.type === 'ASSET' && parseInt(a.code) >= 1400,
  );

  const currentAssetLines = buildLines(currentAssetAccounts);
  const nonCurrentAssetLines = buildLines(nonCurrentAssetAccounts);

  // For current assets: sum only sub-accounts (not headers)
  const totalCurrentAssets = currentAssetLines
    .filter((l) => !l.isHeader)
    .reduce((s, l) => s + l.balance, 0);

  // For non-current: PPE net of accumulated depreciation
  const totalNonCurrentAssets = nonCurrentAssetLines
    .filter((l) => !l.isHeader)
    .reduce((s, l) => s + l.balance, 0);

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  // ── Liabilities ───────────────────────────────────────────────────────────
  const currentLiabilityAccounts = coa.filter(
    (a) => a.type === 'LIABILITY' && parseInt(a.code) < 2400,
  );
  const nonCurrentLiabilityAccounts = coa.filter(
    (a) => a.type === 'LIABILITY' && parseInt(a.code) >= 2400,
  );

  const currentLiabilityLines = buildLines(currentLiabilityAccounts);
  const nonCurrentLiabilityLines = buildLines(nonCurrentLiabilityAccounts);

  const totalCurrentLiabilities = currentLiabilityLines
    .filter((l) => !l.isHeader)
    .reduce((s, l) => s + l.balance, 0);

  const totalNonCurrentLiabilities = nonCurrentLiabilityLines
    .filter((l) => !l.isHeader)
    .reduce((s, l) => s + l.balance, 0);

  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  // ── Net Income (Revenue - Expenses) → flows into Equity ──────────────────
  const revenueAccounts = coa.filter((a) => a.type === 'REVENUE' && a.parentCode);
  const expenseAccounts = coa.filter((a) => a.type === 'EXPENSE' && a.parentCode);

  const totalRevenue = revenueAccounts.reduce((s, a) => s + bal(a), 0);
  const totalExpenses = expenseAccounts.reduce((s, a) => s + bal(a), 0);
  const netIncome = totalRevenue - totalExpenses;

  // ── Equity ────────────────────────────────────────────────────────────────
  const equityAccounts = coa.filter((a) => a.type === 'EQUITY' && a.parentCode);
  const equityLines = buildLines(equityAccounts);

  const totalEquityFromAccounts = equityLines.reduce((s, l) => s + l.balance, 0);
  const totalEquity = totalEquityFromAccounts + netIncome;

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  return {
    asOfDate,
    fiscalPeriodName,

    currentAssets: {
      title: 'Current Assets',
      lines: currentAssetLines,
      total: totalCurrentAssets,
    },
    nonCurrentAssets: {
      title: 'Non-Current Assets',
      lines: nonCurrentAssetLines,
      total: totalNonCurrentAssets,
    },
    totalAssets,

    currentLiabilities: {
      title: 'Current Liabilities',
      lines: currentLiabilityLines,
      total: totalCurrentLiabilities,
    },
    nonCurrentLiabilities: {
      title: 'Non-Current Liabilities',
      lines: nonCurrentLiabilityLines,
      total: totalNonCurrentLiabilities,
    },
    totalLiabilities,

    equity: {
      title: 'Equity',
      lines: [
        ...equityLines,
        // Net income as a computed line
        {
          accountCode: 'NET-INCOME',
          accountName: 'Current Period Net Income',
          balance: netIncome,
          isContra: false,
          isHeader: false,
          indent: 2,
        },
      ],
      total: totalEquity,
    },
    totalEquity,

    totalLiabilitiesAndEquity,
    isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01,
  };
}
