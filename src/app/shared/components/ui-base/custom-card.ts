import { Component, computed, input } from '@angular/core';

/**
 * CustomCard Component
 * 
 * SOURCE: Avalon Theme (PrimeNG v21 theme)
 * - Original file: avalon-ng-21.0.0/src/app/layout/components/ui/customcard.ts
 * - License: Commercial (Avalon Theme by PrimeNG)
 * - Reference: https://primeng.org/
 * 
 * DESCRIPTION:
 * A styled card wrapper with header/title, action buttons, and content slots.
 * Uses Avalon's Tailwind CSS classes and PrimeUX design tokens.
 * 
 * USAGE:
 * <div custom-card [styleClass]="'mb-4'">
 *   <h3 card-title>Title</h3>
 *   <div card-action><button>Action</button></div>
 *   <p>Card content</p>
 * </div>
 */
@Component({
  selector: '[custom-card]',
  standalone: true,
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

  hostClass = computed(
    () => `flex flex-col rounded-2xl border bg-surface-0 dark:bg-surface-950 ${this.styleClass()}`,
  );
  headerClass = computed(
    () =>
      `max-h-14 pl-5 pr-3 py-3 flex items-center justify-between gap-2 border-b ${this.headerStyleClass()}`,
  );
  titleClass = computed(() => `text-lg font-medium ${this.titleStyleClass()}`);
  actionClass = computed(
    () => `flex items-center justify-between gap-4 ${this.actionStyleClass()}`,
  );
  contentClass = computed(() => `flex-1 overflow-auto  ${this.contentStyleClass()}`);
}
