import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Column<T = any> {
  header: string;
  key: keyof T;
  sortable?: boolean;
  width?: string;
  template?: (value: any) => string;
}

/**
 * Reusable Table Component with sorting and pagination
 * WCAG 2.1 AA compliant with semantic HTML and ARIA support
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T = any> {
  @Input() columns: Column<T>[] = [];
  @Input() rows: T[] = [];
  @Input() pageSize = 10;
  @Input() sortBy: keyof T | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() isLoading = false;
  @Input() emptyMessage = 'No data available';

  currentPage = 1;

  get paginatedRows(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  sort(column: Column<T>): void {
    if (!column.sortable) return;

    if (this.sortBy === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column.key;
      this.sortDirection = 'asc';
    }

    this.rows.sort((a, b) => {
      const aVal = a[this.sortBy!];
      const bVal = b[this.sortBy!];

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.currentPage = 1;
  }

  getSortIcon(column: Column<T>): string {
    if (!column.sortable || this.sortBy !== column.key) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getColumnValue(row: T, column: Column<T>): string {
    const value = row[column.key];
    return column.template ? column.template(value) : String(value || '');
  }
}
