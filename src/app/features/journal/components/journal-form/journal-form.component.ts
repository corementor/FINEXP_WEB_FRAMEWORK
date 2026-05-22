import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import {
  JournalEntry,
  JournalEntryType,
  CreateJournalEntryRequest,
  ChartOfAccount,
  FiscalPeriod,
  DrCr,
  validateJournalEntry,
} from '@app/core/models/journal.models';
import { JournalFacadeService } from '../../services/journal-facade.service';

const ENTRY_TYPES: { label: string; value: JournalEntryType; description: string }[] = [
  { label: 'General', value: 'GENERAL', description: 'Routine business transactions' },
  { label: 'Adjustment', value: 'ADJUSTMENT', description: 'Period-end accruals and corrections' },
  { label: 'Closing', value: 'CLOSING', description: 'Close revenue/expense to retained earnings' },
  { label: 'Reversing', value: 'REVERSING', description: 'Auto-reversal of a prior accrual' },
];

@Component({
  selector: 'app-journal-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ...APP_UI_COMPONENTS],
  template: `
    <form [formGroup]="form" class="space-y-6" novalidate>
      <!-- ── Header fields ─────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Fiscal Period -->
        <div class="flex flex-col gap-1.5">
          <app-label [required]="true">Fiscal Period</app-label>
          <select
            formControlName="fiscalPeriodId"
            (change)="onPeriodChange()"
            class="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0
                   focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            [class.border-red-500]="isInvalid('fiscalPeriodId')"
            aria-label="Fiscal period"
          >
            <option value="">Select period...</option>
            <option *ngFor="let p of fiscalPeriods" [value]="p.id" [disabled]="p.closed">
              {{ p.name }}{{ p.closed ? ' (Closed)' : '' }}
            </option>
          </select>
          <small *ngIf="isInvalid('fiscalPeriodId')" class="text-red-500 text-xs"
            >Fiscal period is required</small
          >
          <small
            *ngIf="selectedPeriod?.closed"
            class="text-red-500 text-xs flex items-center gap-1"
          >
            <i class="pi pi-lock text-xs"></i> This period is closed. Select an open period.
          </small>
        </div>

        <!-- Entry Date -->
        <div class="flex flex-col gap-1.5">
          <app-label [required]="true">Entry Date</app-label>
          <input
            type="date"
            formControlName="entryDate"
            [min]="selectedPeriod?.startDate"
            [max]="selectedPeriod?.endDate"
            class="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0
                   focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            [class.border-red-500]="isInvalid('entryDate')"
            aria-label="Entry date"
          />
          <small *ngIf="isInvalid('entryDate')" class="text-red-500 text-xs">
            Date is required and must fall within the selected fiscal period
          </small>
          <small *ngIf="selectedPeriod && !isInvalid('entryDate')" class="text-surface-400 text-xs">
            Period: {{ selectedPeriod.startDate }} – {{ selectedPeriod.endDate }}
          </small>
        </div>

        <!-- Entry Type -->
        <div class="flex flex-col gap-1.5">
          <app-label [required]="true">Entry Type</app-label>
          <select
            formControlName="entryType"
            class="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0
                   focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            [class.border-red-500]="isInvalid('entryType')"
            aria-label="Entry type"
          >
            <option value="">Select type...</option>
            <option *ngFor="let t of entryTypes" [value]="t.value">
              {{ t.label }} — {{ t.description }}
            </option>
          </select>
          <small *ngIf="isInvalid('entryType')" class="text-red-500 text-xs"
            >Entry type is required</small
          >
        </div>

        <!-- Reference (read-only, system-generated) -->
        <div class="flex flex-col gap-1.5">
          <app-label>Reference Number</app-label>
          <input
            type="text"
            [value]="entry?.referenceNumber ?? 'Auto-generated on save'"
            readonly
            class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700
                   bg-surface-100 dark:bg-surface-900 text-surface-500 dark:text-surface-400
                   cursor-not-allowed font-mono text-sm"
            aria-label="Reference number (read-only)"
          />
        </div>
      </div>

      <!-- Description -->
      <app-input
        formControlName="description"
        label="Description"
        type="textarea"
        placeholder="Describe the business purpose of this journal entry..."
        [error]="isInvalid('description')"
        errorMessage="Description is required (min 10 characters)"
        [rows]="2"
      />

      <!-- Tags -->
      <div class="flex flex-col gap-1.5">
        <app-label>Tags</app-label>
        <div class="flex flex-wrap gap-2 min-h-[2rem]" role="list" aria-label="Tags">
          <span
            *ngFor="let tag of tags; let i = index"
            role="listitem"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                   bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
          >
            {{ tag }}
            <button
              type="button"
              (click)="removeTag(i)"
              class="hover:text-red-500 transition-colors"
              [attr.aria-label]="'Remove tag ' + tag"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </span>
        </div>
        <div class="flex gap-2">
          <app-input
            [(ngModel)]="tagInput"
            [ngModelOptions]="{ standalone: true }"
            placeholder="Type a tag and press Enter..."
            (keydown.enter)="addTag($event)"
          />
          <app-button
            label="Add Tag"
            variant="secondary"
            size="small"
            (clicked)="addTagFromButton()"
          />
        </div>
      </div>

      <!-- ── Journal Lines ──────────────────────────────────────────────── -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Journal Lines <span class="text-red-500">*</span>
            </span>
            <p class="text-xs text-surface-400 mt-0.5">
              Each line has one account, one amount, and one side (DR or CR). Total DR must equal
              Total CR.
            </p>
          </div>
          <app-button
            label="Add Line"
            icon="pi pi-plus"
            variant="secondary"
            size="small"
            (clicked)="addLine()"
          />
        </div>

        <div class="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <table class="w-full text-sm" role="table" aria-label="Journal lines">
            <thead class="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th
                  class="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase w-8"
                >
                  #
                </th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase">
                  Account
                </th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase">
                  Narration
                </th>
                <th
                  class="px-3 py-3 text-center text-xs font-semibold text-surface-500 uppercase w-24"
                >
                  DR / CR
                </th>
                <th
                  class="px-3 py-3 text-right text-xs font-semibold text-surface-500 uppercase w-36"
                >
                  Amount
                </th>
                <th class="px-3 py-3 w-8"></th>
              </tr>
            </thead>

            <tbody
              formArrayName="lines"
              class="divide-y divide-surface-100 dark:divide-surface-700"
            >
              <tr
                *ngFor="let line of linesArray.controls; let i = index"
                [formGroupName]="i"
                class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
              >
                <!-- Row number -->
                <td class="px-3 py-2 text-xs text-surface-400 text-center">{{ i + 1 }}</td>

                <!-- Account selector (from Chart of Accounts) -->
                <td class="px-3 py-2">
                  <select
                    formControlName="accountCode"
                    (change)="onAccountSelect(i)"
                    class="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600
                           bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0
                           focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                    [class.border-red-400]="lineInvalid(i, 'accountCode')"
                    aria-label="Account"
                  >
                    <option value="">Select account...</option>
                    <optgroup *ngFor="let group of accountGroups" [label]="group.label">
                      <option *ngFor="let acc of group.accounts" [value]="acc.code">
                        {{ acc.code }} — {{ acc.name }}
                      </option>
                    </optgroup>
                  </select>
                  <!-- Show account type hint -->
                  <div *ngIf="getLineAccount(i) as acc" class="mt-1 flex items-center gap-1">
                    <span
                      class="text-xs px-1.5 py-0.5 rounded"
                      [ngClass]="accountTypeClass(acc.type)"
                    >
                      {{ acc.type }}
                    </span>
                    <span class="text-xs text-surface-400"
                      >Normal balance: {{ acc.normalBalance }}</span
                    >
                  </div>
                </td>

                <!-- Narration -->
                <td class="px-3 py-2">
                  <input
                    formControlName="description"
                    placeholder="Line narration (optional)"
                    class="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600
                           bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0
                           focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                    aria-label="Line narration"
                  />
                </td>

                <!-- DR / CR toggle -->
                <td class="px-3 py-2 text-center">
                  <div
                    class="inline-flex rounded-lg border border-surface-300 dark:border-surface-600 overflow-hidden"
                  >
                    <button
                      type="button"
                      (click)="setDrCr(i, 'DR')"
                      class="px-3 py-1.5 text-xs font-bold transition-colors"
                      [class]="
                        getDrCrValue(i) === 'DR'
                          ? 'bg-blue-600 text-white'
                          : 'bg-surface-0 dark:bg-surface-800 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
                      "
                      aria-label="Debit"
                    >
                      DR
                    </button>
                    <button
                      type="button"
                      (click)="setDrCr(i, 'CR')"
                      class="px-3 py-1.5 text-xs font-bold transition-colors border-l border-surface-300 dark:border-surface-600"
                      [class]="
                        getDrCrValue(i) === 'CR'
                          ? 'bg-green-600 text-white'
                          : 'bg-surface-0 dark:bg-surface-800 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
                      "
                      aria-label="Credit"
                    >
                      CR
                    </button>
                  </div>
                </td>

                <!-- Amount -->
                <td class="px-3 py-2">
                  <input
                    formControlName="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600
                           bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0
                           focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm text-right font-mono"
                    [class.border-red-400]="lineInvalid(i, 'amount')"
                    aria-label="Amount"
                  />
                  <small *ngIf="lineInvalid(i, 'amount')" class="text-red-500 text-xs"
                    >Amount must be > 0</small
                  >
                </td>

                <!-- Remove -->
                <td class="px-3 py-2 text-center">
                  <button
                    type="button"
                    (click)="removeLine(i)"
                    [disabled]="linesArray.length <= 2"
                    class="text-surface-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    [attr.aria-label]="'Remove line ' + (i + 1)"
                  >
                    <i class="pi pi-trash text-sm"></i>
                  </button>
                </td>
              </tr>

              <tr *ngIf="linesArray.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-surface-400 text-sm">
                  No lines yet. Click "Add Line" to begin.
                </td>
              </tr>
            </tbody>

            <!-- Totals -->
            <tfoot
              *ngIf="linesArray.length > 0"
              class="border-t-2 border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800"
            >
              <tr>
                <td
                  colspan="3"
                  class="px-3 py-3 text-sm font-bold text-surface-700 dark:text-surface-300"
                >
                  Totals
                </td>
                <td class="px-3 py-3 text-center">
                  <span
                    *ngIf="isBalanced"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400"
                  >
                    <i class="pi pi-check-circle"></i> Balanced
                  </span>
                  <span
                    *ngIf="!isBalanced"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-red-500"
                  >
                    <i class="pi pi-times-circle"></i> Unbalanced
                  </span>
                </td>
                <td class="px-3 py-3 text-right font-mono text-sm font-bold">
                  <div class="flex flex-col items-end gap-0.5">
                    <span class="text-blue-600 dark:text-blue-400"
                      >DR {{ totalDR | number: '1.2-2' }}</span
                    >
                    <span class="text-green-600 dark:text-green-400"
                      >CR {{ totalCR | number: '1.2-2' }}</span
                    >
                    <span *ngIf="!isBalanced" class="text-red-500 text-xs">
                      Diff: {{ totalDR - totalCR | number: '1.2-2' }}
                    </span>
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Validation errors -->
        <div
          *ngIf="validationErrors.length > 0"
          class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 space-y-1"
          role="alert"
        >
          <p class="text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-1">
            <i class="pi pi-exclamation-triangle"></i> Please fix the following:
          </p>
          <ul class="list-disc list-inside space-y-0.5">
            <li *ngFor="let err of validationErrors" class="text-xs text-red-600 dark:text-red-400">
              {{ err }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        <app-button label="Cancel" variant="secondary" size="small" (clicked)="cancelled.emit()" />
        <app-button
          [label]="submitLabel"
          variant="primary"
          size="small"
          icon="pi pi-check"
          [disabled]="!canSubmit"
          [loading]="loading"
          (clicked)="submit()"
        />
      </div>
    </form>
  `,
})
export class JournalFormComponent implements OnInit, OnChanges {
  @Input() entry: JournalEntry | null = null;
  @Input() loading = false;
  @Input() submitLabel = 'Save Entry';
  @Output() submitted = new EventEmitter<CreateJournalEntryRequest>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(JournalFacadeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly entryTypes = ENTRY_TYPES;
  fiscalPeriods: FiscalPeriod[] = [];
  chartOfAccounts: ChartOfAccount[] = [];
  tagInput = '';
  tags: string[] = [];
  form!: FormGroup;

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
    this.facade.getFiscalPeriods().subscribe((p) => {
      this.fiscalPeriods = p;
      this.cdr.markForCheck();
    });
    this.facade.getChartOfAccounts().subscribe((c) => {
      this.chartOfAccounts = c;
      this.cdr.markForCheck();
    });
    if (this.entry) this.patchForm(this.entry);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entry'] && this.form) {
      this.entry ? this.patchForm(this.entry) : this.resetForm();
    }
  }

  // ── Form building ─────────────────────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group({
      fiscalPeriodId: ['', Validators.required],
      entryDate: ['', Validators.required],
      entryType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      lines: this.fb.array([]),
    });
    this.addLine();
    this.addLine();
  }

  private patchForm(entry: JournalEntry): void {
    this.tags = [...(entry.tags ?? [])];
    this.linesArray.clear();
    entry.lines.forEach((l) => this.linesArray.push(this.buildLineGroup(l)));
    this.form.patchValue({
      fiscalPeriodId: entry.fiscalPeriodId,
      entryDate: entry.entryDate,
      entryType: entry.entryType,
      description: entry.description,
    });
  }

  private resetForm(): void {
    this.tags = [];
    this.linesArray.clear();
    this.form.reset();
    this.addLine();
    this.addLine();
  }

  private buildLineGroup(
    data?: Partial<{
      accountCode: string;
      accountName: string;
      accountType: string;
      drCr: DrCr;
      amount: number;
      description: string;
    }>,
  ): FormGroup {
    return this.fb.group({
      accountCode: [data?.accountCode ?? '', Validators.required],
      accountName: [data?.accountName ?? ''],
      accountType: [data?.accountType ?? ''],
      drCr: [data?.drCr ?? 'DR'],
      amount: [data?.amount ?? null, [Validators.required, Validators.min(0.01)]],
      description: [data?.description ?? ''],
    });
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  get linesArray(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  get totalDR(): number {
    return this.linesArray.controls
      .filter((c) => c.get('drCr')?.value === 'DR')
      .reduce((s, c) => s + (+c.get('amount')?.value || 0), 0);
  }

  get totalCR(): number {
    return this.linesArray.controls
      .filter((c) => c.get('drCr')?.value === 'CR')
      .reduce((s, c) => s + (+c.get('amount')?.value || 0), 0);
  }

  get isBalanced(): boolean {
    return this.linesArray.length >= 2 && Math.abs(this.totalDR - this.totalCR) < 0.005;
  }

  get selectedPeriod(): FiscalPeriod | undefined {
    return this.fiscalPeriods.find((p) => p.id === this.form.get('fiscalPeriodId')?.value);
  }

  get validationErrors(): string[] {
    if (!this.form.touched) return [];
    const lines = this.linesArray.controls.map((c) => ({
      drCr: c.get('drCr')?.value as DrCr,
      amount: +c.get('amount')?.value || 0,
    }));
    const period = this.selectedPeriod;
    if (!period) return [];
    return validateJournalEntry(lines, period, this.form.get('entryDate')?.value ?? '').errors;
  }

  get canSubmit(): boolean {
    return (
      this.form.valid &&
      this.isBalanced &&
      !this.selectedPeriod?.closed &&
      this.validationErrors.length === 0
    );
  }

  // ── Account groups for optgroup ───────────────────────────────────────────

  get accountGroups(): { label: string; accounts: ChartOfAccount[] }[] {
    const types = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] as const;
    return types.map((t) => ({
      label: t,
      accounts: this.chartOfAccounts.filter((a) => a.type === t),
    }));
  }

  accountTypeClass(type: string): string {
    const map: Record<string, string> = {
      ASSET: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      LIABILITY: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      EQUITY: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      REVENUE: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      EXPENSE: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    };
    return map[type] ?? '';
  }

  // ── Line helpers ──────────────────────────────────────────────────────────

  addLine(): void {
    this.linesArray.push(this.buildLineGroup());
  }

  removeLine(i: number): void {
    if (this.linesArray.length > 2) this.linesArray.removeAt(i);
  }

  onAccountSelect(i: number): void {
    const code = this.linesArray.at(i).get('accountCode')?.value;
    const acc = this.chartOfAccounts.find((a) => a.code === code);
    if (acc) {
      this.linesArray.at(i).patchValue({
        accountName: acc.name,
        accountType: acc.type,
        drCr: acc.normalBalance, // Default to normal balance side
      });
    }
  }

  setDrCr(i: number, side: DrCr): void {
    this.linesArray.at(i).get('drCr')?.setValue(side);
  }

  getDrCrValue(i: number): DrCr {
    return this.linesArray.at(i).get('drCr')?.value ?? 'DR';
  }

  getLineAccount(i: number): ChartOfAccount | undefined {
    const code = this.linesArray.at(i).get('accountCode')?.value;
    return this.chartOfAccounts.find((a) => a.code === code);
  }

  onPeriodChange(): void {
    this.form.get('entryDate')?.setValue('');
  }

  // ── Tags ──────────────────────────────────────────────────────────────────

  addTag(event: Event): void {
    event.preventDefault();
    this.addTagFromButton();
  }

  addTagFromButton(): void {
    const tag = this.tagInput.trim().toLowerCase();
    if (tag && !this.tags.includes(tag)) this.tags.push(tag);
    this.tagInput = '';
  }

  removeTag(i: number): void {
    this.tags.splice(i, 1);
  }

  // ── Validation helpers ────────────────────────────────────────────────────

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  lineInvalid(i: number, field: string): boolean {
    const c = this.linesArray.at(i)?.get(field);
    return !!(c?.invalid && c.touched);
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.canSubmit) return;

    const v = this.form.getRawValue();
    this.submitted.emit({
      fiscalPeriodId: v.fiscalPeriodId,
      entryDate: v.entryDate,
      entryType: v.entryType,
      description: v.description,
      tags: this.tags,
      lines: v.lines.map((l: any) => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        accountType: l.accountType,
        drCr: l.drCr,
        amount: +l.amount,
        description: l.description,
      })),
    });
  }
}
