import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE';
  details: string;
  ipAddress: string;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...APP_UI_COMPONENTS, SpinnerComponent],
  templateUrl: './audit-trail.component.html',
})
export class AuditTrailComponent implements OnInit, OnDestroy {
  auditLogs: AuditEntry[] = [];
  filteredLogs: AuditEntry[] = [];

  isLoading = false;
  error: string | null = null;
  filterForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      user: ['All Users'],
      action: ['All Actions'],
    });
  }

  ngOnInit(): void {
    this.loadAuditLogs();
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.error = null;

    // Mock audit data - in production, this would call an AuditApiService via facade
    setTimeout(() => {
      this.auditLogs = [
        {
          id: '1',
          timestamp: '2026-03-26 10:45:12',
          user: 'Admin',
          action: 'UPDATE',
          details: 'Changed salary for EMP-102 from 5000 to 5500',
          ipAddress: '192.168.1.15',
        },
        {
          id: '2',
          timestamp: '2026-03-26 09:12:05',
          user: 'System',
          action: 'ACTIVATE',
          details: 'Auto-activated scheduled task TSK-089',
          ipAddress: 'localhost',
        },
        {
          id: '3',
          timestamp: '2026-03-25 14:30:22',
          user: 'Admin',
          action: 'CREATE',
          details: 'Created new employee EMP-150 - John Smith',
          ipAddress: '192.168.1.10',
        },
        {
          id: '4',
          timestamp: '2026-03-25 11:15:00',
          user: 'User',
          action: 'UPDATE',
          details: 'Updated department for EMP-145 to Engineering',
          ipAddress: '192.168.1.20',
        },
      ];
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }

  applyFilters(): void {
    const { dateFrom, dateTo, user, action } = this.filterForm.value;

    this.filteredLogs = this.auditLogs.filter((log) => {
      const matchesUser = user === 'All Users' || log.user === user;
      const matchesAction = action === 'All Actions' || log.action === action;
      return matchesUser && matchesAction;
    });
  }

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700';
      case 'ACTIVATE':
        return 'bg-emerald-100 text-emerald-700';
      case 'DEACTIVATE':
        return 'bg-orange-100 text-orange-700';
      case 'DELETE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  exportPDF(): void {
    console.log('Exporting audit logs to PDF...');
    // TODO: Implement PDF export
  }
}
