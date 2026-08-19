import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { FinanceEntry } from '@app/core/models';

@Component({
    selector: '[account-transactions]',
    standalone: true,
    imports: [CommonModule, FormsModule, CustomCard, ButtonModule, TableModule, Tag],
    template: `
        <div custom-card>
            <h3 card-title>Recent Journal Entries</h3>
            <div class="px-4 py-3">
                <p-table [value]="data()" dataKey="reference" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5, 10, 20, 50]" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th>Reference</th>
                            <th>Description</th>
                            <th>Counterparty</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th style="width: 3rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-entry>
                        <tr>
                            <td>
                                <span class="font-medium">{{ entry.reference }}</span>
                            </td>
                            <td>
                                <span class="line-clamp-1">{{ entry.description }}</span>
                            </td>
                            <td>{{ entry.counterparty }}</td>
                            <td>
                                <span class="text-sm text-surface-500">{{ entry.date }}</span>
                            </td>
                            <td>
                                <span class="text-lg line-clamp-1 font-semibold" [class]="entry.direction === 'CREDIT' ? 'text-green-600' : 'text-red-600'">
                                    {{ entry.direction === 'CREDIT' ? '+' : '-' }}{{ formatCurrency(entry.amount) }}
                                </span>
                            </td>
                            <td>
                                <p-tag [severity]="statusSeverity(entry.status)" [value]="statusLabel(entry.status)" />
                            </td>
                            <td>
                                <p-button icon="pi pi-ellipsis-h" severity="secondary" [text]="true" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="7">
                                <div class="text-surface-500 text-center py-6">No journal entry recorded</div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #paginatorleft>
                        <div class="text-sm text-surface-500 font-medium">Showing {{ data().length }} results</div>
                    </ng-template>
                    <ng-template #paginatorright>
                        <div class="flex items-center gap-2"></div>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `,
    host: {
        class: 'col-span-12'
    }
})
export class AccountTransactions {
    data = input<FinanceEntry[]>([]);

    currency = input<string>('USD');

    statusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
        switch (status) {
            case 'POSTED':
                return 'success';
            case 'PENDING':
                return 'warn';
            case 'REJECTED':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    statusLabel(status: string): string {
        switch (status) {
            case 'POSTED':
                return 'Posted';
            case 'PENDING':
                return 'Pending approval';
            case 'REJECTED':
                return 'Rejected';
            default:
                return status;
        }
    }

    formatCurrency(value: number, currency: string = this.currency()): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(value);
    }
}
