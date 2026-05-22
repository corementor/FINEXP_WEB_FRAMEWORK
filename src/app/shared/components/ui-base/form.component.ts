import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { AppButtonComponent } from './button.component';
import { AppLabelComponent } from './typography.component';

// ─── Field Types ────────────────────────────────────────────────────────────

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'custom';

export interface SelectOption {
  label: string;
  value: any;
}

export interface FormField {
  key: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  /** Grid column span: 1 (half) or 2 (full). Default: 1 */
  colSpan?: 1 | 2;
  /** For 'select' type */
  options?: SelectOption[];
  /** For 'textarea' type */
  rows?: number;
  /** For 'number' type */
  min?: number;
  max?: number;
  /** For 'password' type - show strength meter */
  feedback?: boolean;
}

export interface FormConfig {
  fields: FormField[];
  /** Number of grid columns. Default: 2 */
  columns?: 1 | 2 | 3;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  showReset?: boolean;
  /** Show loading spinner on submit button */
  loading?: boolean;
}

/**
 * AppForm Component (Avalon Style)
 *
 * SOURCE: PrimeNG Form Components
 * DESIGN: Avalon template by PrimeNG
 * - PrimeNG v21.0.2
 * - Tailwind CSS with dark mode support
 * - License: MIT
 *
 * DESCRIPTION:
 * A highly reusable, generic form component driven by a declarative config.
 * Supports all common field types, reactive forms integration, validation
 * display, and Avalon-consistent styling with dark mode.
 *
 * FEATURES:
 * - Config-driven field rendering (text, email, password, number, date,
 *   textarea, select, checkbox, custom ng-template slot)
 * - Reactive FormGroup binding (pass your own FormGroup)
 * - Inline validation error display via ValidationService pattern
 * - Responsive grid layout (1–3 columns, per-field colSpan)
 * - Submit / Cancel / Reset actions with loading state
 * - Dark mode support via Avalon surface tokens
 * - Custom field slot via ng-template #customField
 *
 * USAGE:
 * ```ts
 * form = this.fb.group({
 *   firstName: ['', Validators.required],
 *   email:     ['', [Validators.required, Validators.email]],
 *   role:      ['', Validators.required],
 * });
 *
 * config: FormConfig = {
 *   columns: 2,
 *   submitLabel: 'Save',
 *   fields: [
 *     { key: 'firstName', type: 'text',   label: 'First Name', required: true },
 *     { key: 'email',     type: 'email',  label: 'Email',      required: true },
 *     { key: 'role',      type: 'select', label: 'Role',       required: true,
 *       options: [{ label: 'Admin', value: 'ADMIN' }, { label: 'User', value: 'USER' }] },
 *   ],
 * };
 * ```
 *
 * ```html
 * <app-form
 *   [form]="form"
 *   [config]="config"
 *   (submitted)="onSubmit($event)"
 *   (cancelled)="onCancel()"
 * />
 * ```
 *
 * CUSTOM FIELD SLOT:
 * ```html
 * <app-form [form]="form" [config]="config" (submitted)="onSubmit($event)">
 *   <ng-template #customField let-field>
 *     <my-special-input [formControlName]="field.key" />
 *   </ng-template>
 * </app-form>
 * ```
 */
@Component({
  selector: 'app-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    CheckboxModule,
    DatePickerModule,
    InputNumberModule,
    PasswordModule,
    AppButtonComponent,
    AppLabelComponent,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div [class]="gridClass">
        @for (field of config.fields; track field.key) {
          <!-- Custom field slot -->
          @if (field.type === 'custom' && customFieldTpl) {
            <div [class]="fieldWrapClass(field)">
              <ng-container
                [ngTemplateOutlet]="customFieldTpl"
                [ngTemplateOutletContext]="{ $implicit: field, control: getControl(field.key) }"
              />
            </div>
          } @else {
            <div [class]="fieldWrapClass(field)">
              <!-- Label -->
              <app-label [forId]="field.key" [required]="field.required ?? false">
                {{ field.label }}
              </app-label>

              <!-- text | email | date -->
              @if (['text', 'email', 'date'].includes(field.type)) {
                <input
                  pInputText
                  [id]="field.key"
                  [type]="field.type"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  [class.ng-invalid]="isInvalid(field.key)"
                  class="w-full"
                  [attr.aria-describedby]="isInvalid(field.key) ? 'err-' + field.key : null"
                />
              }

              <!-- password -->
              @if (field.type === 'password') {
                <p-password
                  [inputId]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  [feedback]="field.feedback ?? false"
                  [toggleMask]="true"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [class.ng-invalid]="isInvalid(field.key)"
                />
              }

              <!-- number -->
              @if (field.type === 'number') {
                <p-inputnumber
                  [inputId]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  [min]="field.min"
                  [max]="field.max"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [class.ng-invalid]="isInvalid(field.key)"
                />
              }

              <!-- textarea -->
              @if (field.type === 'textarea') {
                <textarea
                  pTextarea
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  [rows]="field.rows ?? 3"
                  [class.ng-invalid]="isInvalid(field.key)"
                  class="w-full"
                  [attr.aria-describedby]="isInvalid(field.key) ? 'err-' + field.key : null"
                ></textarea>
              }

              <!-- select -->
              @if (field.type === 'select') {
                <p-select
                  [inputId]="field.key"
                  [formControlName]="field.key"
                  [options]="field.options ?? []"
                  optionLabel="label"
                  optionValue="value"
                  [placeholder]="field.placeholder ?? 'Select an option'"
                  styleClass="w-full"
                  [class.ng-invalid]="isInvalid(field.key)"
                />
              }

              <!-- checkbox -->
              @if (field.type === 'checkbox') {
                <div class="flex items-center gap-2 mt-1">
                  <p-checkbox [inputId]="field.key" [formControlName]="field.key" [binary]="true" />
                  <label
                    [for]="field.key"
                    class="text-sm text-surface-700 dark:text-surface-300 cursor-pointer"
                  >
                    {{ field.placeholder ?? field.label }}
                  </label>
                </div>
              }

              <!-- Validation error -->
              @if (isInvalid(field.key)) {
                <small [id]="'err-' + field.key" class="text-red-500 dark:text-red-400 text-xs">
                  {{ getError(field.key, field.label) }}
                </small>
              }

              <!-- Hint -->
              @if (field.hint && !isInvalid(field.key)) {
                <small class="text-surface-500 dark:text-surface-400 text-xs">
                  {{ field.hint }}
                </small>
              }
            </div>
          }
        }
      </div>

      <!-- Actions -->
      <div
        class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-200 dark:border-surface-700"
      >
        @if (config.showReset) {
          <app-button
            type="button"
            [label]="'Reset'"
            variant="ghost"
            size="small"
            (clicked)="onReset()"
          />
        }
        @if (config.showCancel ?? true) {
          <app-button
            type="button"
            [label]="config.cancelLabel ?? 'Cancel'"
            variant="secondary"
            size="small"
            icon="pi pi-times"
            (clicked)="cancelled.emit()"
          />
        }
        <app-button
          type="submit"
          [label]="config.submitLabel ?? 'Submit'"
          variant="primary"
          size="small"
          icon="pi pi-check"
          [loading]="config.loading ?? false"
          [disabled]="form.invalid || (config.loading ?? false)"
          (clicked)="onSubmit()"
        />
      </div>
    </form>
  `,
})
export class AppFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) config!: FormConfig;

  /** Optional ng-template for 'custom' field type */
  @Input() customFieldTpl?: any;

  @Output() submitted = new EventEmitter<Record<string, any>>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() formChanged = new EventEmitter<Record<string, any>>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.formChanged.emit(val);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get gridClass(): string {
    const cols = this.config.columns ?? 2;
    const map: Record<number, string> = {
      1: 'grid grid-cols-1 gap-4',
      2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    };
    return map[cols] ?? map[2];
  }

  fieldWrapClass(field: FormField): string {
    const span = field.colSpan ?? 1;
    const base = 'flex flex-col gap-1.5';
    return span === 2 ? `${base} md:col-span-2` : base;
  }

  getControl(key: string): AbstractControl | null {
    return this.form.get(key);
  }

  isInvalid(key: string): boolean {
    const ctrl = this.form.get(key);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  getError(key: string, label: string): string {
    const ctrl = this.form.get(key);
    if (!ctrl?.errors) return '';
    const e = ctrl.errors;

    if (e['required']) return `${label} is required`;
    if (e['email']) return 'Please enter a valid email address';
    if (e['minlength'])
      return `${label} must be at least ${e['minlength'].requiredLength} characters`;
    if (e['maxlength']) return `${label} cannot exceed ${e['maxlength'].requiredLength} characters`;
    if (e['min']) return `${label} must be at least ${e['min'].min}`;
    if (e['max']) return `${label} cannot exceed ${e['max'].max}`;
    if (e['pattern']) return `${label} format is invalid`;
    if (e['invalidEmail']) return 'Please enter a valid email address';
    if (e['invalidEmployeeNumber']) return 'Employee number must be in format EMP-XXXX';
    if (e['invalidNationalId']) return 'Please enter a valid national ID';
    if (e['invalidPhone']) return 'Please enter a valid phone number';
    if (e['passwordMismatch']) return 'Passwords do not match';
    if (e['emailTaken']) return 'Email address is already in use';
    if (e['empNumberTaken']) return 'Employee number is already in use';

    return 'Invalid input';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  onReset(): void {
    this.form.reset();
    this.cdr.markForCheck();
  }
}
