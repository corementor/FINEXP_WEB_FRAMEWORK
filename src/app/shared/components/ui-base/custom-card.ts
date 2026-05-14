import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CustomCard Component (Avalon Style)
 *
 * SOURCE: Avalon Theme (PrimeNG v21 theme)
 * - Original file: avalon-ng-21.0.0/src/app/layout/components/ui/customcard.ts
 * - License: Commercial (Avalon Theme by PrimeNG)
 * - Reference: https://primeng.org/
 *
 * DESCRIPTION:
 * A modern styled card wrapper with header/title, action buttons, and content slots.
 * Uses Avalon's Tailwind CSS classes and design tokens with dark mode support.
 * Features:
 * - Rounded corners (2xl)
 * - Avalon color scheme (surface colors)
 * - Dark mode support
 * - Flexible header with title and actions
 * - Customizable styling
 *
 * USAGE:
 * <div custom-card [styleClass]="'mb-4'">
 *   <h3 card-title>My Title</h3>
 *   <div card-action><button>Action</button></div>
 *   <p>Card content goes here</p>
 * </div>
 */
@Component({
  selector: '[custom-card]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClass()">
      <h3 [class]="titleClass()">
        <ng-content select="[card-title]" />
      </h3>
      <div [class]="actionClass()">
        <ng-content select="[card-action]" />
      </div>
    </div>
    <div [class]="contentClass()">
      <ng-content />
    </div>
  `,
  host: {
    '[class]': 'hostClass()',
  },
})
export class CustomCard {
  styleClass = input<string>('');
  headerStyleClass = input<string>('');
  titleStyleClass = input<string>('');
  actionStyleClass = input<string>('');
  contentStyleClass = input<string>('');

  // Avalon color scheme: bg-surface-0 dark:bg-surface-800 for main surface
  hostClass = computed(
    () =>
      `flex flex-col rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 ${this.styleClass()}`,
  );

  // Header with border divider and proper spacing
  headerClass = computed(
    () =>
      `max-h-16 px-6 py-4 flex items-center justify-between gap-2 border-b border-surface-100 dark:border-surface-700 ${this.headerStyleClass()}`,
  );

  // Title styling with Avalon typography
  titleClass = computed(
    () =>
      `text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight ${this.titleStyleClass()}`,
  );

  // Action buttons container
  actionClass = computed(() => `flex items-center justify-end gap-3 ${this.actionStyleClass()}`);

  // Content area with padding and proper overflow handling
  contentClass = computed(() => `flex-1 overflow-auto p-6 ${this.contentStyleClass()}`);
}
