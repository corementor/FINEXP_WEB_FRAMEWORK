import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { TrialBalanceApiService } from './trial-balance-api.service';
import {
  TrialBalance,
  TrialBalanceSection,
  TrialBalanceLine,
  TRIAL_BALANCE_TYPE_META,
} from './trial-balance.models';
import { FiscalPeriod, ChartOfAccount, JournalEntry } from '@app/core/models/journal.models';

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ...APP_UI_COMPONENTS],
  templateUrl: './trial-balance.component.html',
})
export class TrialBalanceComponent implements OnInit {
  private readonly api = inject(TrialBalanceApiService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Expose constants for template access
  readonly TYPE_META = TRIAL_BALANCE_TYPE_META;

  // UI state
  selectedPeriodId = signal<string>('');
  isLoading = signal(true);
  isGenerating = signal(false);
  fiscalPeriods: FiscalPeriod[] = [];
  report = signal<TrialBalance | null>(null);

  // Data stores
  private accounts: ChartOfAccount[] = [];
  private entries: JournalEntry[] = [];

  readonly selectedPeriod = computed(() =>
    this.fiscalPeriods.find((p) => p.id === this.selectedPeriodId()),
  );

  ngOnInit(): void {
    this.loadReferenceData();
  }

  private loadReferenceData(): void {
    let loaded = 0;
    const tryBuild = () => {
      loaded++;
      if (loaded === 3) {
        this.isLoading.set(false);
        this.setupDefaultPeriod();
        this.cdr.markForCheck();
      }
    };

    this.api.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        tryBuild();
      },
      error: (err: Error) => {
        this.toast.error('Error', err.message);
        tryBuild();
      },
    });

    this.api.getPeriods().subscribe({
      next: (data) => {
        this.fiscalPeriods = data;
        tryBuild();
      },
      error: (err: Error) => {
        this.toast.error('Error', err.message);
        tryBuild();
      },
    });

    this.api.getAllJournalEntries().subscribe({
      next: (data) => {
        this.entries = data;
        tryBuild();
      },
      error: (err: Error) => {
        this.toast.error('Error', err.message);
        tryBuild();
      },
    });
  }

  private setupDefaultPeriod(): void {
    const defaultPeriod = [...this.fiscalPeriods].reverse().find((p) => p.closed);
    if (defaultPeriod) {
      this.selectedPeriodId.set(defaultPeriod.id);
      this.generateReport();
    }
  }

  onPeriodChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedPeriodId.set(id);
    this.generateReport();
  }

  generateReport(): void {
    const periodId = this.selectedPeriodId();
    if (!periodId) return;

    this.isGenerating.set(true);
    this.report.set(null);
    this.cdr.markForCheck();

    this.api
      .generateTrialBalance(periodId, this.fiscalPeriods, this.accounts, this.entries)
      .subscribe({
        next: (tb) => {
          this.report.set(tb);
          this.isGenerating.set(false);
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          this.toast.error('Error', err.message);
          this.isGenerating.set(false);
          this.cdr.markForCheck();
        },
      });
  }

  // ── Formatting helpers ────────────────────────────────────────────────────

  formatAmount(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  }

  // ── Section helpers ────────────────────────────────────────────────────────

  sectionHasActivity(section: TrialBalanceSection): boolean {
    return section.lines.some(
      (l) => !l.isHeader && (l.debitAmount !== 0 || l.creditAmount !== 0),
    );
  }

  // ── Style helpers ──────────────────────────────────────────────────────────

  typeColor(type: string): string {
    const meta = TRIAL_BALANCE_TYPE_META[type as keyof typeof TRIAL_BALANCE_TYPE_META];
    return meta?.color ?? 'surface';
  }

  colorClasses(color: string): {
    badge: string;
    text: string;
    header: string;
  } {
    const classes: Record<string, { badge: string; text: string; header: string }> = {
      blue: {
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        text: 'text-blue-700 dark:text-blue-300',
        header: 'bg-blue-50 dark:bg-blue-950',
      },
      red: {
        badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        text: 'text-red-700 dark:text-red-300',
        header: 'bg-red-50 dark:bg-red-950',
      },
      purple: {
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
        text: 'text-purple-700 dark:text-purple-300',
        header: 'bg-purple-50 dark:bg-purple-950',
      },
      green: {
        badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        text: 'text-green-700 dark:text-green-300',
        header: 'bg-green-50 dark:bg-green-950',
      },
      orange: {
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
        text: 'text-orange-700 dark:text-orange-300',
        header: 'bg-orange-50 dark:bg-orange-950',
      },
      surface: {
        badge: 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400',
        text: 'text-surface-500 dark:text-surface-400',
        header: 'bg-surface-50 dark:bg-surface-800',
      },
    };
    return classes[color] ?? classes['surface'];
  }
}