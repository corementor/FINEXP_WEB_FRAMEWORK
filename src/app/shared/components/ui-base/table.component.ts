import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface TableColumn<T = any> {
  field: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  template?: (data: T) => string;
}

/**
 * AppTable Component
 *
 * SOURCE: PrimeNG DataTable (primeng/table)
 * - PrimeNG v21.0.2
 * - License: MIT
 * - Reference: https://primeng.org/datatable
 *
 * WRAPPER PURPOSE:
 * This component wraps PrimeNG's p-table to provide a simplified,
 * props-only API that abstracts PrimeNG internals.
 *
 * FEATURES:
 * - Pagination (10, 25, 50, 100 rows per page)
 * - Sorting (click column headers)
 * - Global search/filter
 * - Responsive layout
 *
 * STYLING:
 * Uses Avalon theme colors and PrimeUX design system.
 *
 * USAGE:
 * <app-table
 *   [columns]="columns"
 *   [rows]="data"
 *   [pageSize]="25"
 *   headerTitle="Users"
 * />
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, InputTextModule],
  template: `
    <p-table
      #table
      [value]="rows"
      [rows]="pageSize"
      [paginator]="paginator"
      [totalRecords]="rows.length"
      [loading]="isLoading"
      [lazy]="false"
      [globalFilterFields]="globalFilterFields"
      styleClass="p-datatable-striped"
      responsiveLayout="scroll"
      [rowsPerPageOptions]="[10, 25, 50, 100]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <ng-template pTemplate="header" *ngIf="showHeader">
        <tr>
          <th
            *ngFor="let col of columns"
            [pSortableColumn]="col.sortable !== false ? getFieldName(col.field) : undefined"
            [style.width]="col.width || 'auto'"
          >
            {{ col.header }}
            <p-sortIcon
              *ngIf="col.sortable !== false"
              [field]="getFieldName(col.field)"
            ></p-sortIcon>
          </th>
        </tr>
        <tr>
          <th *ngFor="let col of columns">
            <input
              pInputText
              type="text"
              placeholder="Search"
              (input)="table.filterGlobal($event, 'contains')"
            />
          </th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-rowData>
        <tr>
          <td *ngFor="let col of columns">{{ getPropertyValue(rowData, col.field) }}</td>
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="columns.length" class="text-center text-gray-500 py-8">
            {{ emptyMessage }}
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class AppTableComponent<T = any> implements OnInit {
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() pageSize = 10;
  @Input() isLoading = false;
  @Input() emptyMessage = 'No records found';
  @Input() headerTitle = 'Data Table';
  @Input() showHeader = true;
  @Input() paginator = true;
  @ViewChild('table') table: any;

  globalFilterFields: string[] = [];

  ngOnInit(): void {
    this.globalFilterFields = this.columns.map((col) => String(col.field));
  }

  getPropertyValue(obj: any, key: PropertyKey): any {
    if (obj == null) return '';
    return typeof key === 'string' ? obj[key] : obj[key as any];
  }

  getFieldName(field: PropertyKey): string {
    return typeof field === 'string' ? field : String(field);
  }
}
