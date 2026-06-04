import { ChartOfAccount, JournalEntry, AccountType, DrCr } from '@app/core/models/journal.models';

// ── Trial Balance Line ───────────────────────────────────────────────────────
export interface TrialBalanceLine {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  normalBalance: DrCr;
  isHeader: boolean;
  isContra: boolean;
  debitAmount: number;
  creditAmount: number;
  netBalance: number;  // Debit - Credit (positive = debit balance, negative = credit balance)
  indent: number;
}

// ── Trial Balance Section ─────────────────────────────────────────────────────
export interface TrialBalanceSection {
  title: string;
  type: AccountType;
  lines: TrialBalanceLine[];
  totalDebits: number;
  totalCredits: number;
  totalBalance: number;
}

// ── Full Trial Balance ───────────────────────────────────────────────────────
export interface TrialBalance {
  asOfDate: string;
  fiscalPeriodName: string;
  generatedAt: string;
  sections: TrialBalanceSection[];
  totalDebits: number;
  totalCredits: number;
  difference: number;  // Should be 0 if books are balanced
  isBalanced: boolean;
}

// ── Compute trial balance lines ───────────────────────────────────────────────
export function computeTrialBalance(
  coa: ChartOfAccount[],
  entries: JournalEntry[],
  asOfDate: string,
  fiscalPeriodName: string,
): TrialBalance {
  // Filter POSTED entries up to asOfDate
  const relevantEntries = entries.filter(
    (e) => e.status === 'POSTED' && e.entryDate <= asOfDate,
  );

  // Compute raw balances per account (DR positive, CR negative)
  const rawBalances = new Map<string, number>();
  relevantEntries.forEach((entry) => {
    entry.lines.forEach((line) => {
      const current = rawBalances.get(line.accountCode) ?? 0;
      const delta = line.drCr === 'DR' ? line.amount : -line.amount;
      rawBalances.set(line.accountCode, current + delta);
    });
  });

  // Build lines for each account type in order
  const types: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
  const sections: TrialBalanceSection[] = [];
  let totalDebits = 0;
  let totalCredits = 0;

  types.forEach((type) => {
    const typeAccounts = coa
      .filter((a) => a.type === type)
      .sort((a, b) => a.code.localeCompare(b.code));

    const lines: TrialBalanceLine[] = typeAccounts.map((acc) => {
      const raw = rawBalances.get(acc.code) ?? 0;
      const naturalBalance = acc.normalBalance === 'DR' ? raw : -raw;
      const finalBalance = acc.isContra ? -naturalBalance : naturalBalance;

      const debitAmount = finalBalance >= 0 ? finalBalance : 0;
      const creditAmount = finalBalance < 0 ? Math.abs(finalBalance) : 0;

      totalDebits += debitAmount;
      totalCredits += creditAmount;

      return {
        accountCode: acc.code,
        accountName: acc.name,
        accountType: acc.type,
        normalBalance: acc.normalBalance,
        isHeader: !acc.parentCode,
        isContra: acc.isContra ?? false,
        debitAmount,
        creditAmount,
        netBalance: finalBalance,
        indent: acc.parentCode ? 1 : 0,
      };
    });

    const sectionTotal = typeAccounts.reduce((sum, acc) => {
      const raw = rawBalances.get(acc.code) ?? 0;
      const naturalBalance = acc.normalBalance === 'DR' ? raw : -raw;
      return sum + (acc.isContra ? -naturalBalance : naturalBalance);
    }, 0);

    sections.push({
      title: type.charAt(0) + type.slice(1).toLowerCase(),
      type,
      lines,
      totalDebits,
      totalCredits,
      totalBalance: sectionTotal,
    });
  });

  const difference = Math.abs(totalDebits - totalCredits);

  return {
    asOfDate,
    fiscalPeriodName,
    generatedAt: new Date().toISOString(),
    sections,
    totalDebits,
    totalCredits,
    difference,
    isBalanced: difference < 0.01,
  };
}

// ── Account type metadata ─────────────────────────────────────────────────────
export const TRIAL_BALANCE_TYPE_META: Record<
  AccountType,
  { label: string; normalBalance: DrCr; color: string }
> = {
  ASSET: {
    label: 'Assets',
    normalBalance: 'DR',
    color: 'blue',
  },
  LIABILITY: {
    label: 'Liabilities',
    normalBalance: 'CR',
    color: 'red',
  },
  EQUITY: {
    label: 'Equity',
    normalBalance: 'CR',
    color: 'purple',
  },
  REVENUE: {
    label: 'Revenue',
    normalBalance: 'CR',
    color: 'green',
  },
  EXPENSE: {
    label: 'Expenses',
    normalBalance: 'DR',
    color: 'orange',
  },
};