import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { JournalFacadeService } from '../../services/journal-facade.service';
import { JournalMutationService } from '../../services/journal-mutation.service';
import { JournalEntry } from '@app/core/models/journal.models';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ...APP_UI_COMPONENTS],
  templateUrl: './journal-list.component.html',
})
export class JournalListComponent {
  private readonly router = inject(Router);
  private readonly facade = inject(JournalFacadeService);
  private readonly mutations = inject(JournalMutationService);
  private readonly toast = inject(ToastService);

  searchTerm = signal('');
  expandedIds = signal<Set<string>>(new Set());

  readonly query = injectQuery(() => ({
    queryKey: ['journal-entries'],
    queryFn: () => firstValueFrom(this.facade.getAll()),
  }));

  readonly entries = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.query.data() ?? [];
    if (!term) return all;
    return all.filter(
      (e) =>
        e.description.toLowerCase().includes(term) ||
        e.entryType.toLowerCase().includes(term) ||
        e.referenceNumber.toLowerCase().includes(term) ||
        e.fiscalPeriodName.toLowerCase().includes(term) ||
        e.tags.some((t) => t.toLowerCase().includes(term)) ||
        e.lines.some(
          (l) =>
            l.accountName.toLowerCase().includes(term) ||
            l.accountCode.toLowerCase().includes(term),
        ),
    );
  });

  readonly postMutation = this.mutations.postMutation();
  readonly reverseMutation = this.mutations.reverseMutation();
  readonly deleteMutation = this.mutations.deleteMutation();

  get isLoading(): boolean { return this.query.isPending(); }
  get error(): string | null { return this.query.error() ? 'Failed to load journal entries' : null; }

  openCreate(): void {
    this.router.navigate(['/journal', 'new']);
  }

  openEdit(entry: JournalEntry): void {
    if (entry.status !== 'DRAFT') {
      this.toast.warn('Cannot Edit', 'Only DRAFT entries can be edited. Create a reversal to correct a posted entry.');
      return;
    }
    this.router.navigate(['/journal', entry.id, 'edit']);
  }

  toggleExpand(id: string): void {
    this.expandedIds.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isExpanded(id: string): boolean { return this.expandedIds().has(id); }

  postEntry(entry: JournalEntry): void {
    if (entry.status !== 'DRAFT') return;
    this.postMutation.mutate(entry.id);
  }

  reverseEntry(entry: JournalEntry): void {
    if (entry.status !== 'POSTED') return;
    if (entry.reversedById) {
      this.toast.warn('Already Reversed', 'This entry has already been reversed.');
      return;
    }
    this.reverseMutation.mutate(entry.id);
  }

  deleteEntry(entry: JournalEntry): void {
    if (entry.status !== 'DRAFT') {
      this.toast.warn('Cannot Delete', 'Only DRAFT entries can be deleted. Posted entries must be reversed.');
      return;
    }
    if (confirm(`Delete ${entry.referenceNumber}? This cannot be undone.`)) {
      this.deleteMutation.mutate(entry.id);
    }
  }

  // ── Accounting helpers ────────────────────────────────────────────────────

  totalDR(entry: JournalEntry): number {
    return entry.lines.filter((l) => l.drCr === 'DR').reduce((s, l) => s + l.amount, 0);
  }

  totalCR(entry: JournalEntry): number {
    return entry.lines.filter((l) => l.drCr === 'CR').reduce((s, l) => s + l.amount, 0);
  }

  isEntryBalanced(entry: JournalEntry): boolean {
    return Math.abs(this.totalDR(entry) - this.totalCR(entry)) < 0.005;
  }

  // ── Style helpers ─────────────────────────────────────────────────────────

  statusClass(status: string): string {
    const map: Record<string, string> = {
      DRAFT:    'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      POSTED:   'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      REVERSED: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
    };
    return map[status] ?? map['DRAFT'];
  }

  typeClass(type: string): string {
    const map: Record<string, string> = {
      GENERAL:   'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      ADJUSTMENT:'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      CLOSING:   'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      REVERSING: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };
    return map[type] ?? map['GENERAL'];
  }

  drCrClass(drCr: string): string {
    return drCr === 'DR'
      ? 'text-blue-600 dark:text-blue-400 font-bold'
      : 'text-green-600 dark:text-green-400 font-bold';
  }

  accountTypeClass(type: string): string {
    const map: Record<string, string> = {
      ASSET:     'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      LIABILITY: 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300',
      EQUITY:    'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      REVENUE:   'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300',
      EXPENSE:   'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    };
    return map[type] ?? '';
  }
}
