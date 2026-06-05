import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Reusable Button Component
 * Variants: primary (blue), secondary (gray), danger (red), ghost (transparent)
 * Sizes: sm, md (default), lg
 * WCAG 2.1 AA compliant with proper accessibility attributes
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel: string | null = null;
  @Output() clicked = new EventEmitter<MouseEvent>();

  variantClasses: string = '';
  sizeClasses: string = '';
  baseClasses =
    'inline-flex items-center justify-center font-medium rounded transition-colors duration-200 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  ngOnInit(): void {
    this.setVariantClasses();
    this.setSizeClasses();
  }

  private setVariantClasses(): void {
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };
    this.variantClasses = variants[this.variant];
  }

  private setSizeClasses(): void {
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    this.sizeClasses = sizes[this.size];
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get ariaPressed(): boolean | null {
    return this.disabled ? null : false;
  }
}
