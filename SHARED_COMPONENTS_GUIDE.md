# Implementation Guide: Shared Components Library

## 1. Button Component

```typescript
// shared/components/button/button.component.ts

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /**
   * Button visual variant
   */
  @Input() variant: ButtonVariant = 'primary';

  /**
   * Button size
   */
  @Input() size: ButtonSize = 'md';

  /**
   * Button type (form control)
   */
  @Input() type: ButtonType = 'button';

  /**
   * Disabled state
   */
  @Input() disabled = false;

  /**
   * Loading state (shows spinner)
   */
  @Input() loading = false;

  /**
   * Full width button
   */
  @Input() fullWidth = false;

  /**
   * Icon to display (optional)
   */
  @Input() icon: string | null = null;

  /**
   * Icon position
   */
  @Input() iconPosition: 'left' | 'right' = 'left';

  /**
   * Aria label for accessibility
   */
  @Input() ariaLabel: string | null = null;

  /**
   * Button click event
   */
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }

  get buttonClasses(): string {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : '',
    ];
    return classes.filter((c) => c).join(' ');
  }
}
```

```html
<!-- shared/components/button/button.component.html -->

<button
  [type]="type"
  [class]="buttonClasses"
  [disabled]="disabled || loading"
  [attr.aria-busy]="loading"
  [attr.aria-label]="ariaLabel"
  (click)="onClick()"
>
  @if (loading) {
  <span class="btn-spinner"></span>
  } @if (icon && iconPosition === 'left') {
  <svg-icon [name]="icon" class="btn-icon"></svg-icon>
  }

  <span class="btn-text">
    <ng-content></ng-content>
  </span>

  @if (icon && iconPosition === 'right') {
  <svg-icon [name]="icon" class="btn-icon"></svg-icon>
  }
</button>
```

```scss
// shared/components/button/button.component.scss

$button-sizes: (
  'xs': (
    padding: 0.375rem 0.75rem,
    font-size: 0.75rem,
  ),
  'sm': (
    padding: 0.5rem 1rem,
    font-size: 0.875rem,
  ),
  'md': (
    padding: 0.75rem 1.5rem,
    font-size: 1rem,
  ),
  'lg': (
    padding: 1rem 2rem,
    font-size: 1.125rem,
  ),
  'xl': (
    padding: 1.25rem 2.5rem,
    font-size: 1.25rem,
  ),
);

$button-variants: (
  'primary': (
    background: #3b82f6,
    color: white,
    hover: #2563eb,
  ),
  'secondary': (
    background: #6b7280,
    color: white,
    hover: #4b5563,
  ),
  'danger': (
    background: #ef4444,
    color: white,
    hover: #dc2626,
  ),
  'success': (
    background: #10b981,
    color: white,
    hover: #059669,
  ),
  'warning': (
    background: #f59e0b,
    color: white,
    hover: #d97706,
  ),
  'ghost': (
    background: transparent,
    color: #374151,
    hover: #f3f4f6,
  ),
);

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  outline: none;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @each $size, $properties in $button-sizes {
    &-#{$size} {
      padding: map-get($properties, 'padding');
      font-size: map-get($properties, 'font-size');
    }
  }

  @each $variant, $properties in $button-variants {
    &-#{$variant} {
      background-color: map-get($properties, 'background');
      color: map-get($properties, 'color');

      &:not(:disabled):hover {
        background-color: map-get($properties, 'hover');
        transform: translateY(-1px);
      }

      &:not(:disabled):active {
        transform: translateY(0);
      }
    }
  }

  &-full-width {
    width: 100%;
  }

  &-spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &-icon {
    width: 1em;
    height: 1em;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## 2. Card Component

```typescript
// shared/components/card/card.component.ts

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type CardPadding = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  /**
   * Card title
   */
  @Input() title: string | null = null;

  /**
   * Card subtitle
   */
  @Input() subtitle: string | null = null;

  /**
   * Card variant/color scheme
   */
  @Input() variant: CardVariant = 'default';

  /**
   * Internal padding
   */
  @Input() padding: CardPadding = 'md';

  /**
   * Show border
   */
  @Input() showBorder = true;

  /**
   * Add shadow
   */
  @Input() shadow = true;

  /**
   * Hover effect
   */
  @Input() hoverable = false;

  get cardClasses(): string {
    const classes = [
      'card',
      `card-${this.variant}`,
      `card-padding-${this.padding}`,
      this.showBorder ? 'card-border' : '',
      this.shadow ? 'card-shadow' : '',
      this.hoverable ? 'card-hoverable' : '',
    ];
    return classes.filter((c) => c).join(' ');
  }
}
```

```html
<!-- shared/components/card/card.component.html -->

<div [class]="cardClasses">
  @if (title || subtitle) {
  <div class="card-header">
    @if (title) {
    <h3 class="card-title">{{ title }}</h3>
    } @if (subtitle) {
    <p class="card-subtitle">{{ subtitle }}</p>
    }
  </div>
  }

  <div class="card-content">
    <ng-content></ng-content>
  </div>
</div>
```

```scss
// shared/components/card/card.component.scss

$card-padding: (
  'xs': 0.75rem,
  'sm': 1rem,
  'md': 1.5rem,
  'lg': 2rem,
  'xl': 2.5rem,
);

$card-variants: (
  'default': (
    bg: white,
    border: #e5e7eb,
    accent: #3b82f6,
  ),
  'primary': (
    bg: #eff6ff,
    border: #bfdbfe,
    accent: #3b82f6,
  ),
  'success': (
    bg: #f0fdf4,
    border: #bbf7d0,
    accent: #10b981,
  ),
  'warning': (
    bg: #fffbeb,
    border: #fde68a,
    accent: #f59e0b,
  ),
  'danger': (
    bg: #fef2f2,
    border: #fecaca,
    accent: #ef4444,
  ),
);

.card {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .card-subtitle {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &-border {
    border: 1px solid #e5e7eb;
  }

  &-shadow {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &-hoverable {
    cursor: pointer;

    &:hover {
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  }

  @each $size, $padding in $card-padding {
    &-padding-#{$size} {
      padding: $padding;
    }
  }

  @each $variant, $colors in $card-variants {
    &-#{$variant} {
      background-color: map-get($colors, 'bg');
      border-color: map-get($colors, 'border');

      .card-header {
        border-bottom-color: map-get($colors, 'border');
      }

      .card-title {
        color: map-get($colors, 'accent');
      }
    }
  }
}
```

## 3. Text Input Component

```typescript
// shared/components/form/text-input.component.ts

import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent {
  /**
   * Form control
   */
  @Input() control!: FormControl;

  /**
   * Field label
   */
  @Input() label: string | null = null;

  /**
   * Placeholder text
   */
  @Input() placeholder = '';

  /**
   * Input type
   */
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';

  /**
   * Required field
   */
  @Input() required = false;

  /**
   * Helper text
   */
  @Input() helperText: string | null = null;

  /**
   * Custom error messages
   */
  @Input() errorMessages: Record<string, string> = {};

  /**
   * Aria-describedby
   */
  @Input() ariaDescribedBy: string | null = null;

  /**
   * Autocomplete value
   */
  @Input() autocomplete = '';

  /**
   * Maxlength
   */
  @Input() maxlength: number | null = null;

  /**
   * Minlength
   */
  @Input() minlength: number | null = null;

  /**
   * Pattern regex
   */
  @Input() pattern: string | null = null;

  /**
   * Readonly
   */
  @Input() readonly = false;

  /**
   * Show character count
   */
  @Input() showCharCount = false;

  get errorMessage(): string | null {
    if (!this.control.touched && !this.control.dirty) {
      return null;
    }

    const errors = this.control.errors;
    if (!errors) {
      return null;
    }

    const errorKey = Object.keys(errors)[0];
    return this.errorMessages[errorKey] || this.getDefaultErrorMessage(errorKey, errors[errorKey]);
  }

  get inputClasses(): string {
    const classes = [
      'input',
      this.control.invalid && this.control.touched ? 'input-error' : '',
      this.readonly ? 'input-readonly' : '',
      this.control.disabled ? 'input-disabled' : '',
    ];
    return classes.filter((c) => c).join(' ');
  }

  get characterCount(): number {
    return this.control.value?.length || 0;
  }

  private getDefaultErrorMessage(key: string, value?: any): string {
    switch (key) {
      case 'required':
        return `${this.label} is required`;
      case 'email':
        return 'Please enter a valid email address';
      case 'minlength':
        return `Minimum ${value.requiredLength} characters required`;
      case 'maxlength':
        return `Maximum ${value.requiredLength} characters allowed`;
      case 'pattern':
        return 'Invalid format';
      default:
        return 'Invalid input';
    }
  }
}
```

```html
<!-- shared/components/form/text-input.component.html -->

<div class="form-group">
  @if (label) {
  <label [for]="control.id" class="form-label">
    {{ label }} @if (required) {
    <span class="form-required" aria-label="required">*</span>
    }
  </label>
  }

  <input
    [formControl]="control"
    [id]="control.id"
    [type]="type"
    [placeholder]="placeholder"
    [readonly]="readonly"
    [pattern]="pattern"
    [maxlength]="maxlength"
    [minlength]="minlength"
    [autocomplete]="autocomplete"
    [class]="inputClasses"
    [attr.aria-required]="required"
    [attr.aria-invalid]="control.invalid && control.touched"
    [attr.aria-describedby]="
      (errorMessage ? control.id + '-error' : null) ||
      (helperText ? control.id + '-helper' : null) ||
      ariaDescribedBy
    "
  />

  @if (showCharCount && maxlength) {
  <div class="form-char-count">{{ characterCount }} / {{ maxlength }}</div>
  } @if (errorMessage) {
  <p [id]="control.id + '-error'" class="form-error">{{ errorMessage }}</p>
  } @else if (helperText) {
  <p [id]="control.id + '-helper'" class="form-helper">{{ helperText }}</p>
  }
</div>
```

```scss
// shared/components/form/text-input.component.scss

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-required {
  color: #ef4444;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: white;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled,
  &-disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &-readonly {
    background-color: #f9fafb;
    cursor: default;
  }

  &-error {
    border-color: #ef4444;

    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
}

.form-error {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-helper {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.form-char-count {
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
}
```

## 4. Modal Component

```typescript
// shared/components/modal/modal.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  /**
   * Modal title
   */
  @Input() title: string | null = null;

  /**
   * Modal size
   */
  @Input() size: ModalSize = 'md';

  /**
   * Show close button
   */
  @Input() showCloseButton = true;

  /**
   * Show backdrop
   */
  @Input() showBackdrop = true;

  /**
   * Close on backdrop click
   */
  @Input() closeOnBackdropClick = true;

  /**
   * Close on escape key
   */
  @Input() closeOnEscape = true;

  /**
   * Modal closed event
   */
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.closeOnEscape) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  get modalClasses(): string {
    return `modal-${this.size}`;
  }
}
```

```html
<!-- shared/components/modal/modal.component.html -->

<div class="modal-container">
  <!-- Backdrop -->
  @if (showBackdrop) {
  <div class="modal-backdrop" (click)="onBackdropClick()" aria-hidden="true"></div>
  }

  <!-- Modal -->
  <div
    class="modal"
    [class]="modalClasses"
    role="dialog"
    [attr.aria-modal]="true"
    [attr.aria-labelledby]="title ? 'modal-title' : null"
  >
    @if (title || showCloseButton) {
    <div class="modal-header">
      @if (title) {
      <h2 id="modal-title" class="modal-title">{{ title }}</h2>
      } @if (showCloseButton) {
      <button
        class="modal-close"
        (click)="close()"
        [attr.aria-label]="'Close ' + (title || 'dialog')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      }
    </div>
    }

    <div class="modal-body">
      <ng-content></ng-content>
    </div>

    @if (ng-content-footer) {
    <div class="modal-footer">
      <ng-content select="[modal-footer]"></ng-content>
    </div>
    }
  </div>
</div>
```

```scss
// shared/components/modal/modal.component.scss

$modal-sizes: (
  'sm': 24rem,
  'md': 28rem,
  'lg': 32rem,
  'xl': 42rem,
  'full': calc(100% - 2rem),
);

.modal-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-in-out;
}

.modal {
  position: relative;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-in-out;

  @each $size, $width in $modal-sizes {
    &-#{$size} {
      width: $width;
      max-width: 90vw;
    }
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    gap: 1rem;
  }

  &-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }

  &-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    &:hover {
      color: #1f2937;
      background-color: #f3f4f6;
      border-radius: 0.375rem;
    }

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  }

  &-body {
    padding: 1.5rem;
  }

  &-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 5. Toast Container Component

```typescript
// shared/components/toasts/toast-container.component.ts

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastItemComponent } from './toast-item.component';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  standalone: true,
  imports: [CommonModule, ToastItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  trackByToastId(_: number, toast: any): number {
    return toast.id;
  }
}
```

```html
<!-- shared/components/toasts/toast-container.component.html -->

<div class="toast-container" role="region" aria-live="polite" aria-atomic="true">
  @for (toast of toastService.toasts() || []; track trackByToastId($index, toast)) {
  <app-toast-item [toast]="toast" (remove)="toastService.remove(toast.id)"></app-toast-item>
  }
</div>
```

```scss
// shared/components/toasts/toast-container.component.scss

.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;

  @media (max-width: 640px) {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
```

## Benefits

✅ **Reusable Components**: Use across entire application  
✅ **Consistent UI**: Unified design language  
✅ **Accessibility**: Built-in ARIA labels and semantic HTML  
✅ **Type-Safe**: Full TypeScript support  
✅ **OnPush Optimization**: Better change detection  
✅ **Responsive**: Mobile and desktop support  
✅ **Customizable**: Variants, sizes, and states  
✅ **Well-Documented**: Clear props and usage examples
