import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted';

/**
 * AppHeading Component (Avalon Style)
 *
 * DESIGN: Avalon template by PrimeNG
 * - Tailwind CSS with dark mode support
 * - Multiple heading levels (h1-h6)
 * - Avalon color theme
 *
 * FEATURES:
 * - Semantic HTML heading tags
 * - Customizable size and color
 * - Dark mode support
 * - Proper line height and letter spacing
 *
 * USAGE:
 * <app-heading level="h1" text="My Title" />
 * <app-heading level="h2" text="Subtitle" color="secondary" />
 */
@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 *ngIf="level === 'h1'" [class]="getClass()"><ng-content /></h1>
    <h2 *ngIf="level === 'h2'" [class]="getClass()"><ng-content /></h2>
    <h3 *ngIf="level === 'h3'" [class]="getClass()"><ng-content /></h3>
    <h4 *ngIf="level === 'h4'" [class]="getClass()"><ng-content /></h4>
    <h5 *ngIf="level === 'h5'" [class]="getClass()"><ng-content /></h5>
    <h6 *ngIf="level === 'h6'" [class]="getClass()"><ng-content /></h6>
  `,
})
export class AppHeadingComponent {
  @Input() level: HeadingLevel = 'h2';
  @Input() color: TextColor = 'primary';

  getClass(): string {
    const sizeMap: Record<HeadingLevel, string> = {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
    };

    const colorMap: Record<TextColor, string> = {
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-surface-900 dark:text-surface-0',
      success: 'text-green-600 dark:text-green-400',
      danger: 'text-red-600 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
      info: 'text-blue-600 dark:text-blue-400',
      muted: 'text-surface-500 dark:text-surface-400',
    };

    return `${sizeMap[this.level]} ${colorMap[this.color]} leading-tight`;
  }
}

/**
 * AppText Component (Avalon Style)
 *
 * DESIGN: Avalon template by PrimeNG
 * - Tailwind CSS with dark mode support
 * - Multiple text sizes
 * - Avalon color theme
 *
 * FEATURES:
 * - Customizable size and color
 * - Dark mode support
 * - Bold/italic variants
 * - Proper line height
 *
 * USAGE:
 * <app-text size="base" color="secondary" text="Description text" />
 */
@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: ` <p [class]="getClass()"><ng-content /></p> `,
})
export class AppTextComponent {
  @Input() size: TextSize = 'base';
  @Input() color: TextColor = 'secondary';
  @Input() bold = false;
  @Input() italic = false;

  getClass(): string {
    const sizeMap: Record<TextSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    };

    const colorMap: Record<TextColor, string> = {
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-surface-700 dark:text-surface-300',
      success: 'text-green-600 dark:text-green-400',
      danger: 'text-red-600 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
      info: 'text-blue-600 dark:text-blue-400',
      muted: 'text-surface-500 dark:text-surface-400',
    };

    const fontWeight = this.bold ? 'font-semibold' : 'font-normal';
    const fontStyle = this.italic ? 'italic' : 'not-italic';

    return `${sizeMap[this.size]} ${colorMap[this.color]} ${fontWeight} ${fontStyle} leading-relaxed`;
  }
}

/**
 * AppLabel Component (Avalon Style)
 *
 * DESIGN: Avalon template by PrimeNG
 * - Tailwind CSS with dark mode support
 * - Form label styling
 *
 * FEATURES:
 * - For attribute support
 * - Required indicator
 * - Dark mode support
 *
 * USAGE:
 * <app-label for="email" text="Email Address" [required]="true" />
 */
@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [for]="forId" class="text-sm font-medium text-surface-900 dark:text-surface-0">
      <ng-content />
      <span *ngIf="required" class="ml-1 text-red-500">*</span>
    </label>
  `,
})
export class AppLabelComponent {
  @Input() forId: string = '';
  @Input() required = false;
}
