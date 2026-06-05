import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

/**
 * Reusable TextInput Component with validation support
 * WCAG 2.1 AA compliant with error messages and labels
 */
@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements OnInit {
  @Input() label: string | null = null;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error: string | null = null;
  @Input() hint: string | null = null;
  @Input() formControl: FormControl | null = null;
  @Input() id: string | null = null;
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private static idCounter = 0;
  generatedId: string = '';

  ngOnInit(): void {
    if (!this.id) {
      this.generatedId = `app-input-${TextInputComponent.idCounter++}`;
    } else {
      this.generatedId = this.id;
    }
  }

  onInput(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
    if (this.formControl) {
      this.formControl.setValue(value);
    }
  }

  onBlur(): void {
    this.blur.emit();
    if (this.formControl) {
      this.formControl.markAsTouched();
    }
  }

  get hasError(): boolean {
    return this.error !== null || !!(this.formControl?.invalid && this.formControl?.touched);
  }

  get errorMessage(): string {
    if (this.error) return this.error;
    if (this.formControl?.hasError('required')) return 'This field is required';
    if (this.formControl?.hasError('email')) return 'Please enter a valid email';
    if (this.formControl?.hasError('minlength'))
      return `Minimum length is ${this.formControl.getError('minlength').requiredLength}`;
    if (this.formControl?.hasError('maxlength'))
      return `Maximum length is ${this.formControl.getError('maxlength').requiredLength}`;
    return '';
  }

  get inputClasses(): string {
    const baseClasses =
      'block w-full rounded-lg border px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const states = this.hasError
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500';
    const disabled = this.disabled
      ? 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'
      : '';

    return `${baseClasses} ${states} ${disabled}`;
  }
}
