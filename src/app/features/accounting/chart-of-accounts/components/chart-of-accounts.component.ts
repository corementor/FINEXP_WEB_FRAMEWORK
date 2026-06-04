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
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { JournalFacadeService } from '../../journal/services/journal-facade.service';
import { ChartOfAccount, AccountType, AccountStatus, DrCr } from '@app/core/models/journal.models';

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];

const TYPE_META: Record<
  AccountType,
  {
    label: string;
    range: string;
    normalBalance: DrCr;
    color: string;
    icon: string;
    bsSection: string;
  }
> = {
  ASSET: {
    label: 'Assets',
    range: '1000–1999',
    normalBalance: 'DR',
    color: 'blue',
    icon: 'pi-building',
    bsSection: 'Balance Sheet',
  },
  LIABILITY: {
    label: 'Liabilities',
    range: '2000–2999',
    normalBalance: 'CR',
    color: 'red',
    icon: 'pi-credit-card',
    bsSection: 'Balance Sheet',
  },
  EQUITY: {
    label: 'Equity',
    range: '3000–3999',
    normalBalance: 'CR',
    color: 'purple',
    icon: 'pi-chart-pie',
    bsSection: 'Balance Sheet',
  },
  REVENUE: {
    label: 'Revenue',
    range: '4000–4999',
    normalBalance: 'CR',
    color: 'green',
    icon: 'pi-arrow-up',
    bsSection: 'Income Statement',
  },
  EXPENSE: {
    label: 'Expenses',
    range: '5000–5999',
    normalBalance: 'DR',
    color: 'orange',
    icon: 'pi-arrow-down',
    bsSection: 'Income Statement',
  },
};

const COLOR_CLASSES: Record<
  string,
  { badge: string; header: string; border: string; text: string }
> = {
  blue: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    header: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
  },
  red: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    header: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-700 dark:text-red-300',
  },
  purple: {
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    header: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-700 dark:text-purple-300',
  },
  green: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    header: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-700 dark:text-green-300',
  },
  orange: {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    header: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-700 dark:text-orange-300',
  },
};

/**
 * Chart of Accounts — Professional Finance Page
 *
 * Features:
 * - Grouped by account type (Assets / Liabilities / Equity / Revenue / Expenses)
 * - Hierarchical display: header accounts → sub-accounts (indented)
 * - Contra account identification
 * - Inline create/edit via side drawer (no page navigation needed for simple edits)
 * - Deactivate (soft-delete) / Reactivate — accounts are never hard-deleted
 * - Search across code, name, description
 * - Summary stats bar: total accounts, active, inactive, by type
 * - Normal balance indicator (DR/CR) per account type
 * - Balance Sheet vs Income Statement classification
 */
@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerModule,
    InputTextModule,
    TextareaModule,
    ...APP_UI_COMPONENTS,
  ],
  templateUrl: './chart-of-accounts.component.html',
})
export class ChartOfAccountsComponent implements OnInit {
  private readonly facade = inject(JournalFacadeService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // ── State ──────────────────────────────────────────────────────────────────

  readonly accounts = signal<ChartOfAccount[]>([]);
  readonly searchTerm = signal('');
  readonly typeFilter = signal<AccountType | 'ALL'>('ALL');
  readonly statusFilter = signal<AccountStatus | 'ALL'>('ALL');
  readonly drawerVisible = signal(false);
  readonly editingCode = signal<string | null>(null);
  isSaving = false;
  isLoading = true;

  readonly accountTypes = ACCOUNT_TYPES;
  readonly typeMeta = TYPE_META;
  readonly colorClasses = COLOR_CLASSES;

  form!: FormGroup;

  // ── Computed ───────────────────────────────────────────────────────────────

  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const type = this.typeFilter();
    const status = this.statusFilter();

    return this.accounts().filter((a) => {
      const matchesSearch =
        !term ||
        a.code.toLowerCase().includes(term) ||
        a.name.toLowerCase().includes(term) ||
        (a.description ?? '').toLowerCase().includes(term);
      const matchesType = type === 'ALL' || a.type === type;
      const matchesStatus = status === 'ALL' || a.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  });

  readonly groupedAccounts = computed(() => {
    const list = this.filtered();
    return ACCOUNT_TYPES.map((type) => ({
      type,
      meta: TYPE_META[type],
      accounts: list.filter((a) => a.type === type),
    })).filter((g) => g.accounts.length > 0);
  });

  readonly stats = computed(() => {
    const all = this.accounts();
    return {
      total: all.length,
      active: all.filter((a) => a.status === 'ACTIVE').length,
      inactive: all.filter((a) => a.status === 'INACTIVE').length,
      byType: ACCOUNT_TYPES.reduce(
        (acc, t) => ({ ...acc, [t]: all.filter((a) => a.type === t).length }),
        {} as Record<AccountType, number>,
      ),
    };
  });

  readonly drawerTitle = computed(() => (this.editingCode() ? 'Edit Account' : 'New Account'));

  readonly isEditMode = computed(() => !!this.editingCode());

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.isLoading = true;
    this.facade.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Error', 'Failed to load chart of accounts');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      normalBalance: ['', Validators.required],
      parentCode: [''],
      isContra: [false],
      status: ['ACTIVE', Validators.required],
      description: [''],
    });

    // Auto-set normalBalance when type changes (accounting default)
    this.form.get('type')?.valueChanges.subscribe((type: AccountType) => {
      if (!type) return;
      const defaultSide: DrCr = ['ASSET', 'EXPENSE'].includes(type) ? 'DR' : 'CR';
      this.form.get('normalBalance')?.setValue(defaultSide);
      this.cdr.markForCheck();
    });
  }

  openCreate(): void {
    this.editingCode.set(null);
    this.form.reset({ status: 'ACTIVE', isContra: false, normalBalance: 'DR' });
    this.form.get('code')?.enable();
    this.drawerVisible.set(true);
  }

  openEdit(account: ChartOfAccount): void {
    this.editingCode.set(account.code);
    this.form.patchValue({
      code: account.code,
      name: account.name,
      type: account.type,
      normalBalance: account.normalBalance,
      parentCode: account.parentCode ?? '',
      isContra: account.isContra ?? false,
      status: account.status,
      description: account.description ?? '',
    });
    this.form.get('code')?.disable(); // code is immutable after creation
    this.drawerVisible.set(true);
  }

  closeDrawer(): void {
    this.drawerVisible.set(false);
    this.editingCode.set(null);
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.isSaving = true;
    this.cdr.markForCheck();

    const payload = {
      code: v.code,
      name: v.name,
      type: v.type as AccountType,
      normalBalance: v.normalBalance as DrCr,
      parentCode: v.parentCode || undefined,
      isContra: v.isContra ?? false,
      status: v.status as AccountStatus,
      description: v.description || undefined,
    };

    const op$ = this.isEditMode()
      ? this.facade.updateAccount(v.code, payload)
      : this.facade.createAccount(payload);

    op$.subscribe({
      next: (saved) => {
        if (this.isEditMode()) {
          this.accounts.update((list) => list.map((a) => (a.code === saved.code ? saved : a)));
          this.toast.success('Updated', `Account ${saved.code} updated`);
        } else {
          this.accounts.update((list) =>
            [...list, saved].sort((a, b) => a.code.localeCompare(b.code)),
          );
          this.toast.success('Created', `Account ${saved.code} — ${saved.name} created`);
        }
        this.isSaving = false;
        this.closeDrawer();
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.toast.error('Error', err.message);
        this.isSaving = false;
        this.cdr.markForCheck();
      },
    });
  }

  // ── Status actions ─────────────────────────────────────────────────────────

  deactivate(account: ChartOfAccount): void {
    if (
      !confirm(
        `Deactivate "${account.code} — ${account.name}"?\n\nThis account will no longer be available for new journal entries. Existing posted entries are unaffected.`,
      )
    )
      return;

    this.facade.deactivateAccount(account.code).subscribe({
      next: (updated) => {
        this.accounts.update((list) => list.map((a) => (a.code === updated.code ? updated : a)));
        this.toast.success('Deactivated', `${account.code} deactivated`);
        this.cdr.markForCheck();
      },
      error: (err: Error) => this.toast.error('Error', err.message),
    });
  }

  reactivate(account: ChartOfAccount): void {
    this.facade.reactivateAccount(account.code).subscribe({
      next: (updated) => {
        this.accounts.update((list) => list.map((a) => (a.code === updated.code ? updated : a)));
        this.toast.success('Reactivated', `${account.code} reactivated`);
        this.cdr.markForCheck();
      },
      error: (err: Error) => this.toast.error('Error', err.message),
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  isHeader(account: ChartOfAccount): boolean {
    return !account.parentCode;
  }

  parentAccounts(type: AccountType): ChartOfAccount[] {
    return this.accounts().filter((a) => a.type === type && !a.parentCode && a.status === 'ACTIVE');
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required']) return 'This field is required';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} characters`;
    if (c.errors['pattern']) return 'Must be a 4-digit code (e.g. 1001)';
    return 'Invalid value';
  }

  selectedType(): AccountType | null {
    return this.form.get('type')?.value || null;
  }
}
