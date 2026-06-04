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
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { JournalFacadeService } from '../../journal/services/journal-facade.service';
import { FiscalPeriod, ChartOfAccount, JournalEntry } from '@app/core/models/journal.models';
import {
  BalanceSheet,
  BalanceSheetSection,
  buildBalanceSheet,
} from '../balance-sheet.models';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ...APP_UI_COMPONENTS],
  templateUrl: './balance-sheet.component.html',
})
export class BalanceSheetComponent implements OnInit {
  private readonly facade = inject(JournalFacadeService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ── Reference data ────────────────────────────────────────────────────────
  fiscalPeriods: FiscalPeriod[] = [];
  private coa: ChartOfAccount[] = [];
  private entries: JournalEntry[] = [];

  // ── UI state ──────────────────────────────────────────────────────────────
  selectedPeriodId = signal<string>('');
  isLoading = signal(true);
  report = signal<BalanceSheet | null>(null);

  readonly selectedPeriod = computed(() =>
    this.fiscalPeriods.find((p) => p.id === this.selectedPeriodId()),
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Load CoA, fiscal periods, and journal entries in parallel
    let loaded = 0;
    const tryBuild = () => {
      loaded++;
      if (loaded === 3) {
        this.isLoading.set(false);
        // Default to the most recent closed period
        const defaultPeriod = [...this.fiscalPeriods].reverse().find((p) => p.closed);
        if (defaultPeriod) {
          this.selectedPeriodId.set(defaultPeriod.id);
          this.buildReport(defaultPeriod.endDate, defaultPeriod.name);
        }
        this.cdr.markForCheck();
      }
    };

    this.facade.getAllAccounts().subscribe((data) => { this.coa = data; tryBuild(); });
    this.facade.getFiscalPeriods().subscribe((data) => { this.fiscalPeriods = data; tryBuild(); });
    this.facade.getAll().subscribe((data) => { this.entries = data; tryBuild(); });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  onPeriodChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedPeriodId.set(id);
    const period = this.fiscalPeriods.find((p) => p.id === id);
    if (period) this.buildReport(period.endDate, period.name);
  }

  private buildReport(asOfDate: string, periodName: string): void {
    const sheet = buildBalanceSheet(this.coa, this.entries, asOfDate, periodName);
    this.report.set(sheet);
    this.cdr.markForCheck();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  formatAmount(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  }

  isNegative(value: number): boolean {
    return value < 0;
  }

  sectionHasActivity(section: BalanceSheetSection): boolean {
    return section.lines.some((l) => !l.isHeader && l.balance !== 0);
  }
}
