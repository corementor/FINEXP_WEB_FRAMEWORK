/**
 * Centralized UI Component Library (Avalon Style)
 * All components use PrimeNG with Avalon styling and dark mode support
 * Props-based configuration only - no raw PrimeNG API exposure
 *
 * USAGE:
 * import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
 *
 * @Component({
 *   imports: [APP_UI_COMPONENTS],
 *   template: `
 *     <app-button label="Click me" variant="primary" (clicked)="onClicked()" />
 *     <app-input label="Name" type="text" (changed)="onChanged($event)" />
 *     <app-table [columns]="columns" [rows]="rows" />
 *     <app-toast />
 *   `
 * })
 */

import { CustomCard } from './custom-card';
import { AppButtonComponent } from './button.component';
import { AppTableComponent } from './table.component';
import { AppToastComponent } from './toast.component';
import { AppInputComponent } from './input.component';
import { AppModalComponent } from './modal.component';
import { AppSpinnerComponent } from './spinner.component';
import { AppHeadingComponent, AppTextComponent, AppLabelComponent } from './typography.component';

// Export individual components
export { CustomCard } from './custom-card';
export { AppButtonComponent, type AppButtonVariant, type AppButtonSize } from './button.component';
export { AppTableComponent, type TableColumn } from './table.component';
export { AppToastComponent, type ToastSeverity } from './toast.component';
export { AppInputComponent, type InputType } from './input.component';
export { AppModalComponent } from './modal.component';
export { AppSpinnerComponent, type SpinnerSize } from './spinner.component';
export {
  AppHeadingComponent,
  AppTextComponent,
  AppLabelComponent,
  type HeadingLevel,
  type TextSize,
  type TextColor,
} from './typography.component';

// Export as a single module for easy imports
export const APP_UI_COMPONENTS = [
  CustomCard,
  AppButtonComponent,
  AppTableComponent,
  AppToastComponent,
  AppInputComponent,
  AppModalComponent,
  AppSpinnerComponent,
  AppHeadingComponent,
  AppTextComponent,
  AppLabelComponent,
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
