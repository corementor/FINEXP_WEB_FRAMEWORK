import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';

interface Transaction {
    id: number;
    user: {
        name: string;
        avatar: {
            fallback: string;
            class: string;
            image?: string;
        };
    };
    date: string;
    amount: {
        value: number;
        increase: boolean;
        currency: string;
    };
    status: 'success' | 'pending' | 'failed' | 'review';
    account: string;
}

@Component({
    selector: '[account-transactions]',
    standalone: true,
    imports: [CommonModule, FormsModule, CustomCard, ButtonModule, TableModule, Avatar, Tag],
    template: `
        <div custom-card>
            <h3 card-title>Account Transactions</h3>
            <div class="px-4 py-3">
                <p-table [value]="transactions()" [(selection)]="selectedTransactions" dataKey="id" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5, 10, 20, 50]" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Account</th>
                            <th>Status</th>
                            <th style="width: 3rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-transaction>
                        <tr>
                            <td>
                                <p-tableCheckbox [value]="transaction" />
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <p-avatar [image]="transaction.user.avatar?.image" [label]="transaction.user.avatar?.fallback" size="large" [styleClass]="transaction.user.avatar?.class + ' !font-medium !text-base !w-10 !h-10 !rounded-xl'" />
                                    <span class="text-lg line-clamp-1">{{ transaction.user.name }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="text-sm text-surface-500">{{ transaction.date }}</span>
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <span class="text-lg line-clamp-1 font-semibold"> {{ transaction.amount.increase ? '+' : '-' }}{{ formatCurrency(transaction.amount.value, transaction.amount.currency) }} </span>
                                </div>
                            </td>
                            <td>{{ transaction.account }}</td>
                            <td>
                                <p-tag [severity]="statusMap[transaction.status]" [value]="capitalize(transaction.status)" />
                            </td>
                            <td>
                                <p-button icon="pi pi-ellipsis-h" severity="secondary" [text]="true" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #paginatorleft>
                        <div class="text-sm text-surface-500 font-medium">Showing {{ transactions().length }} results</div>
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
    selectedTransactions: Transaction[] = [];

    statusMap: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
        success: 'success',
        pending: 'warn',
        failed: 'danger',
        review: 'secondary'
    };

    transactions = signal<Transaction[]>([
        {
            id: 1,
            user: {
                name: 'Onyama Limba',
                avatar: { fallback: 'OL', class: '!bg-rose-200 !text-rose-950' }
            },
            date: 'May 24th, 2024',
            amount: { value: 7627.9, increase: true, currency: 'USD' },
            status: 'success',
            account: '**** **** 2534'
        },
        {
            id: 2,
            user: {
                name: 'Sarah Wilson',
                avatar: { fallback: 'SW', class: '!bg-blue-200 !text-blue-950' }
            },
            date: 'May 23rd, 2024',
            amount: { value: 3450.5, increase: false, currency: 'USD' },
            status: 'pending',
            account: '**** **** 8721'
        },
        {
            id: 3,
            user: {
                name: 'Michael Chen',
                avatar: { fallback: 'MC', class: '!bg-green-200 !text-green-950' }
            },
            date: 'May 23rd, 2024',
            amount: { value: 5890.75, increase: true, currency: 'USD' },
            status: 'success',
            account: '**** **** 1459'
        },
        {
            id: 4,
            user: {
                name: 'Emma Thompson',
                avatar: { fallback: 'ET', class: '!bg-purple-200 !text-purple-950' }
            },
            date: 'May 22nd, 2024',
            amount: { value: 2175.25, increase: false, currency: 'USD' },
            status: 'failed',
            account: '**** **** 9632'
        },
        {
            id: 5,
            user: {
                name: 'David Rodriguez',
                avatar: { fallback: 'DR', class: '!bg-amber-200 !text-amber-950' }
            },
            date: 'May 22nd, 2024',
            amount: { value: 4325.6, increase: true, currency: 'USD' },
            status: 'review',
            account: '**** **** 7845'
        },
        {
            id: 6,
            user: {
                name: 'Lisa Anderson',
                avatar: { fallback: 'LA', class: '!bg-indigo-200 !text-indigo-950' }
            },
            date: 'May 21st, 2024',
            amount: { value: 6780.3, increase: true, currency: 'USD' },
            status: 'success',
            account: '**** **** 3698'
        },
        {
            id: 7,
            user: {
                name: 'James Parker',
                avatar: { fallback: 'JP', class: '!bg-teal-200 !text-teal-950' }
            },
            date: 'May 21st, 2024',
            amount: { value: 1950.45, increase: false, currency: 'USD' },
            status: 'pending',
            account: '**** **** 4127'
        }
    ]);

    formatCurrency(value: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(value);
    }

    capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
