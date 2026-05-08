import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import type { ButtonSeverity } from 'primeng/button';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'ghost';
export type AppButtonSize = 'small' | 'normal' | 'large';

/**
 * AppButton Component
 * 
 * SOURCE: PrimeNG Button (primeng/button)
 * - PrimeNG v21.0.2
 * - License: MIT
 * - Reference: https://primeng.org/button
 * 
 * WRAPPER PURPOSE:
 * This component wraps PrimeNG's p-button to provide a simplified,
 * props-only API that abstracts PrimeNG internals.
 * 
 * STYLING:
 * Uses Avalon theme colors and PrimeUX design system.
 * 
 * USAGE:
 * <app-button 
 *   label="Save" 
 *   variant="primary" 
 *   size="normal"
 *   icon="pi pi-save"
 *   [loading]="isSaving"
 *   (clicked)="onSave()"
 * />
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  template: `
    <p-button
      [label]="label"
      [icon]="icon"
      [severity]="pngSeverity()"
      [size]="pngSize()"
      [disabled]="disabled"
      [loading]="loading"
      [outlined]="outlined"
      [text]="variant === 'ghost'"
      [styleClass]="customClass"
      (click)="onClick()"
      [attr.aria-label]="ariaLabel"
    />
  `,
})
export class AppButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() variant: AppButtonVariant = 'primary';
  @Input() size: AppButtonSize = 'normal';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() outlined = false;
  @Input() customClass = '';
  @Input() ariaLabel: string | null = null;
  @Output() clicked = new EventEmitter<void>();

  pngSeverity = computed(() => {
    const severityMap: Record<AppButtonVariant, ButtonSeverity> = {
      primary: 'primary',
      secondary: 'secondary',
      danger: 'danger',
      success: 'success',
      info: 'info',
      ghost: 'secondary',
    };
    return severityMap[this.variant];
  });

  pngSize = computed(() => {
    const sizeMap: Record<AppButtonSize, 'small' | 'large'> = {
      small: 'small',
      normal: 'large',
      large: 'large',
    };
    return sizeMap[this.size];
  });

  onClick(): void {
    this.clicked.emit();
  }
}
