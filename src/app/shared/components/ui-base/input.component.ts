import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea';

/**
 * AppInput Component (Avalon Style)
 *
 * SOURCE: PrimeNG Input (primeng/inputtext)
 * DESIGN: Avalon template by PrimeNG
 * - PrimeNG v21.0.2
 * - Tailwind CSS with dark mode support
 * - License: MIT
 * - Reference: https://primeng.org/inputtext
 *
 * FEATURES:
 * - Text, email, password, number, date, textarea input types
 * - Floating label support
 * - Error state with messages
 * - Disabled state
 * - Full width option
 * - Dark mode support
 * - Avalon color theme
 * - ControlValueAccessor integration
 *
 * USAGE:
 * <app-input
 *   label="Email"
 *   type="email"
 *   [value]="email"
 *   [error]="emailError"
 *   errorMessage="Invalid email"
 *   (changed)="onEmailChange($event)"
 * />
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, FloatLabelModule, TextareaModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-2 w-full">
      <p-floatLabel *ngIf="label && type !== 'textarea'">
        <input
          pInputText
          [type]="type"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          [disabled]="disabled"
          [placeholder]="placeholder"
          class="w-full"
          [class.ng-invalid]="error"
          [attr.aria-label]="label"
          [attr.aria-describedby]="error ? 'error-' + label : null"
        />
        <label>{{ label }}</label>
      </p-floatLabel>

      <div *ngIf="type === 'textarea'" class="flex flex-col gap-2">
        <label *ngIf="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">
          {{ label }}
        </label>
        <textarea
          pTextarea
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          [disabled]="disabled"
          [placeholder]="placeholder"
          [rows]="rows"
          class="w-full"
          [class.ng-invalid]="error"
          [attr.aria-label]="label"
          [attr.aria-describedby]="error ? 'error-' + label : null"
        ></textarea>
      </div>

      <small *ngIf="error" [id]="'error-' + label" class="text-red-500 dark:text-red-400 text-xs">
        {{ errorMessage || 'This field is required' }}
      </small>

      <small *ngIf="hint && !error" class="text-surface-500 dark:text-surface-400 text-xs">
        {{ hint }}
      </small>
    </div>
  `,
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: InputType = 'text';
  @Input() value: any = '';
  @Input() placeholder: string = '';
  @Input() disabled = false;
  @Input() error = false;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() rows = 3;
  @Input() fullWidth = true;

  @Output() changed = new EventEmitter<any>();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  onValueChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.changed.emit(value);
  }

  writeValue(obj: any): void {
    if (obj != null) {
      this.value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
