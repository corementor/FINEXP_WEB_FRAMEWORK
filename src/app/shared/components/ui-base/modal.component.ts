import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

/**
 * AppModal Component (Avalon Style)
 *
 * SOURCE: PrimeNG Dialog (primeng/dialog)
 * DESIGN: Avalon template by PrimeNG
 * - PrimeNG v21.0.2
 * - Tailwind CSS with dark mode support
 * - License: MIT
 * - Reference: https://primeng.org/dialog
 *
 * FEATURES:
 * - Modal/dialog with customizable header and footer
 * - Template support for content
 * - Configurable size and position
 * - Backdrop click to close option
 * - Avalon color theme
 * - Dark mode support
 * - Drag and drop support
 *
 * USAGE:
 * <app-modal
 *   [visible]="showDialog"
 *   header="Delete Item"
 *   [showFooter]="true"
 *   (onHide)="showDialog = false"
 * >
 *   <ng-template #content>
 *     Are you sure?
 *   </ng-template>
 *   <ng-template #footer>
 *     <app-button label="Cancel" variant="secondary" (clicked)="onCancel()" />
 *     <app-button label="Delete" variant="danger" (clicked)="onDelete()" />
 *   </ng-template>
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="header"
      [modal]="modal"
      [style]="{ width: width }"
      [maximizable]="maximizable"
      [draggable]="draggable"
      [closable]="closable"
      [closeOnEscape]="closeOnEscape"
      styleClass="rounded-2xl"
      contentStyleClass="bg-surface-0 dark:bg-surface-800 p-6"
      (onHide)="onHide.emit()"
    >
      <ng-container *ngIf="contentTemplate">
        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
      </ng-container>

      <ng-template #footer *ngIf="showFooter && footerTemplate">
        <div
          class="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700"
        >
          <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
        </div>
      </ng-template>

      <ng-template #defaultFooter *ngIf="showFooter && !footerTemplate">
        <div
          class="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700"
        >
          <p-button
            label="Close"
            severity="secondary"
            [outlined]="true"
            (onClick)="onHide.emit()"
            styleClass="cursor-pointer"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
})
export class AppModalComponent {
  @Input() visible = false;
  @Input() header = 'Dialog';
  @Input() width = '50vw';
  @Input() modal = true;
  @Input() maximizable = false;
  @Input() draggable = true;
  @Input() closable = true;
  @Input() closeOnEscape = true;
  @Input() showFooter = true;
  @Input() contentTemplate?: TemplateRef<any>;
  @Input() footerTemplate?: TemplateRef<any>;

  @Output() onHide = new EventEmitter<void>();
}
