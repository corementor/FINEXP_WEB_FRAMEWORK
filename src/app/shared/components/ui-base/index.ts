/**
 * Centralized UI Component Library
 * All components use PrimeNG with Avalon styling
 * Props-based configuration only - no raw PrimeNG API exposure
 *
 * USAGE:
 * import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
 *
 * @Component({
 *   imports: [APP_UI_COMPONENTS],
 *   template: `
 *     <app-button label="Click me" variant="primary" (clicked)="onClicked()" />
 *     <app-card [data]="cardData" />
 *     <app-table [columns]="columns" [rows]="rows" />
 *     <app-toast />
 *   `
 * })
 */

import { CustomCard } from './custom-card';
import { AppButtonComponent } from './button.component';
import { AppTableComponent } from './table.component';
import { AppToastComponent } from './toast.component';

// Export individual components
export { CustomCard } from './custom-card';
export { AppButtonComponent, type AppButtonVariant, type AppButtonSize } from './button.component';
export { AppTableComponent, type TableColumn } from './table.component';
export { AppToastComponent, type ToastSeverity } from './toast.component';

// Export as a single module for easy imports
export const APP_UI_COMPONENTS = [
  CustomCard,
  AppButtonComponent,
  AppTableComponent,
  AppToastComponent,
];

/**
 * Quick Reference:
 *
 * BUTTON USAGE:
 * <app-button label="Save" variant="primary" size="normal" (clicked)="onSave()" />
 *
 * VARIANTS: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'ghost'
 * SIZES: 'small' | 'normal' | 'large'
 *
 * ─────────────────────────────────────────────────────────
 *
 * CARD USAGE:
 * <div custom-card>
 *   <h3 card-title>Card Title</h3>
 *   <div card-action>
 *     <app-button label="Edit" />
 *   </div>
 *   <p>Card content here</p>
 * </div>
 *
 * ─────────────────────────────────────────────────────────
 *
 * TABLE USAGE:
 * <app-table
 *   [columns]="columns"
 *   [rows]="rows"
 *   headerTitle="Users"
 *   pageSize="25"
 * />
 *
 * Column Definition:
 * columns: TableColumn<User>[] = [
 *   { field: 'name', header: 'Name', sortable: true },
 *   { field: 'email', header: 'Email', filterable: true },
 * ];
 *
 * ─────────────────────────────────────────────────────────
 *
 * TOAST USAGE:
 * constructor(private toast: AppToastComponent) {}
 *
 * this.toast.success('Success!', 'Operation completed');
 * this.toast.error('Error!', 'Something went wrong');
 * this.toast.warn('Warning!', 'Please review');
 * this.toast.info('Info', 'FYI');
 *
 * Or use MessageService directly after injecting AppToastComponent
 */
