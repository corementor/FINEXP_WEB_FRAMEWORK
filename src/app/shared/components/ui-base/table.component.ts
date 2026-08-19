import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface TableColumn<T = any> {
  field: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
}

/**
 * AppTable Component (CRUD with Avalon Style)
 *
 * Modern data table component with:
 * - Pagination, sorting, filtering
 * - Checkbox selection for bulk operations
 * - Create, Update, Delete operations
 * - Dialog forms for editing
 * - Confirmation dialogs
 * - Avalon-inspired styling
 *
 * USAGE:
 * <app-table
 *   [columns]="columns"
 *   [rows]="data"
 *   headerTitle="Products"
 *   (addNew)="onAddNew()"
 *   (saveItem)="onSaveItem($event)"
 *   (deleteItem)="onDeleteItem($event)"
 * >
 *   <ng-template #editForm let-item>
 *     <!-- Your form fields here -->
 *   </ng-template>
 * </app-table>
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="flex flex-col gap-6">
      <p-toast />

      <!-- Toolbar with New and Delete buttons -->
      <!-- <p-toolbar class="mb-6">
        <ng-template #start>
          <p-button
            label="New"
            icon="pi pi-plus"
            class="mr-2 cursor-pointer"
            (onClick)="openNew()"
          />
          <p-button
            severity="danger"
            label="Delete"
            icon="pi pi-trash"
            [outlined]="true"
            styleClass="cursor-pointer"
            (onClick)="deleteSelectedItems()"
            [disabled]="!selectedItems || !selectedItems.length"
          />
        </ng-template>
      </p-toolbar> -->

      <!-- Main Table -->
      <p-table
        #dt
        [value]="rows"
        [rows]="pageSize"
        [paginator]="paginator"
        [globalFilterFields]="globalFilterFields"
        [tableStyle]="{ 'min-width': '75rem' }"
        [selection]="selectedItems"
        (selectionChange)="onSelectionChange($event)"
        [rowHover]="true"
        dataKey="id"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [showCurrentPageReport]="true"
        sortMode="multiple"
        styleClass="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden [&>[data-pc-section=paginatorcontainer]]:border-0! [&_[data-pc-name=pcpaginator]]:rounded-none!"
        tableStyleClass="w-full"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        [rowsPerPageOptions]="[10, 25, 50, 100]"
      >
        <!-- Header with Search -->
        <ng-template #caption>
          <div class="flex items-center justify-between gap-4">
            <h5 class="m-0 text-surface-900 dark:text-surface-0 text-lg font-medium">
              {{ headerTitle }}
            </h5>
            <p-iconfield>
              <p-inputicon class="pi pi-search" />
              <input
                pInputText
                type="text"
                (input)="dt.filterGlobal($event.target.value, 'contains')"
                placeholder="Search..."
                class="w-64"
              />
            </p-iconfield>
          </div>
        </ng-template>

        <!-- Table Header -->
        <ng-template #header>
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox />
            </th>
            <th
              *ngFor="let col of columns"
              [pSortableColumn]="col.sortable !== false ? getFieldName(col.field) : undefined"
              [style.width]="col.width || 'auto'"
            >
              <div class="flex items-center gap-2">
                {{ col.header }}
                <p-sortIcon *ngIf="col.sortable !== false" [field]="getFieldName(col.field)" />
              </div>
            </th>
            <th style="min-width: 12rem">Actions</th>
          </tr>
        </ng-template>

        <!-- Table Body -->
        <ng-template #body let-rowData>
          <tr>
            <td style="width: 3rem">
              <p-tableCheckbox [value]="rowData" />
            </td>
            <td *ngFor="let col of columns" class="text-surface-600 dark:text-surface-400">
              {{ getPropertyValue(rowData, col.field) }}
            </td>
            <td>
              <p-button
                icon="pi pi-pencil"
                class="mr-2"
                [rounded]="true"
                [outlined]="true"
                severity="secondary"
                styleClass="cursor-pointer"
                (click)="editItemHandler(rowData)"
              />
              <p-button
                icon="pi pi-trash"
                severity="danger"
                [rounded]="true"
                [outlined]="true"
                styleClass="cursor-pointer"
                (click)="deleteConfirm(rowData)"
              />
              <ng-container
                *ngIf="actionsTemplate"
                [ngTemplateOutlet]="actionsTemplate"
                [ngTemplateOutletContext]="{ $implicit: rowData }"
              ></ng-container>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Confirmation Dialog -->
      <p-confirmdialog [style]="{ width: '450px' }" />
    </div>
  `,
})
export class AppTableComponent<T = any> implements OnInit {
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() pageSize = 10;
  @Input() headerTitle = 'Data Table';
  @Input() paginator = true;
  @Input() actionsTemplate?: TemplateRef<any>;

  @Output() addNew = new EventEmitter<void>();
  @Output() itemEdited = new EventEmitter<T>();
  @Output() deleteItem = new EventEmitter<T>();
  @Output() deleteSelected = new EventEmitter<T[]>();
  @Output() selectionChanged = new EventEmitter<T[]>();
  @Output() saveItem = new EventEmitter<T>();

  @ViewChild('dt') table!: Table;

  globalFilterFields: string[] = [];
  selectedItems: T[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.globalFilterFields = this.columns.map((col) => String(col.field));
  }

  /**
   * Keep the parent in sync with the rows checked by the user.
   */
  onSelectionChange(items: T[]): void {
    this.selectedItems = items ?? [];
    this.selectionChanged.emit(this.selectedItems);
  }

  /**
   * Clear the current selection, typically after a bulk operation.
   */
  clearSelection(): void {
    this.selectedItems = [];
    this.selectionChanged.emit(this.selectedItems);
  }

  getPropertyValue(obj: any, key: PropertyKey): any {
    if (obj == null) return '';
    return typeof key === 'string' ? obj[key] : obj[key as any];
  }

  getFieldName(field: PropertyKey): string {
    return typeof field === 'string' ? field : String(field);
  }

  openNew(): void {
    this.addNew.emit();
  }

  editItemHandler(item: T): void {
    this.itemEdited.emit(item);
  }

  hideDialog(): void {
    // No longer used - edit dialog moved to parent component
  }

  saveItemHandler(): void {
    // No longer used - edit dialog moved to parent component
  }

  deleteConfirm(item: T): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.deleteItem.emit(item);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedItems(): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedItems.length} selected item(s)?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.deleteSelected.emit(this.selectedItems);
        this.clearSelection();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Items Deleted',
          life: 3000,
        });
      },
    });
  }
}
