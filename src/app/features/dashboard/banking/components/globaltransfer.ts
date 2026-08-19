import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { PendingApprovals } from '@app/core/models';

@Component({
    selector: '[global-transfer]',
    standalone: true,
    imports: [CommonModule, FormsModule, CustomCard, ButtonModule, Menu, Tag],
    template: `
        <div custom-card>
            <h3 card-title>Pending Approvals</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div>
                <div class="p-4">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl font-semibold">{{ formatCurrency(pendingAmount()) }}</div>
                        <p-tag severity="warn" [value]="pendingCount() + ' documents'" />
                    </div>
                    <div class="mt-2 text-surface-500">Waiting for approval in the next payment run</div>
                    <div class="mt-8 space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="text-surface-500">Next payment run</div>
                            <div class="font-medium">{{ nextRunDate() || '-' }}</div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-surface-500">Approved this month</div>
                            <div class="font-medium text-green-600">{{ approvedThisMonth() }}</div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-surface-500">Rejected this month</div>
                            <div class="font-medium text-red-600">{{ rejectedThisMonth() }}</div>
                        </div>
                    </div>
                </div>
                <div class="border-t p-4 flex items-center justify-between">
                    <div>
                        <div class="text-surface-500">Average per document</div>
                        <div class="font-medium mt-1">{{ formatCurrency(averageAmount()) }}</div>
                    </div>
                    <p-button label="Review" icon="pi pi-check-circle" />
                </div>
            </div>
        </div>
    `,
    host: {
        class: 'rounded-2xl flex flex-col overflow-hidden col-span-12 xl:col-span-4 row-span-1'
    }
})
export class GlobalTransfer {
    data = input<PendingApprovals | null>(null);

    currency = input<string>('USD');

    pendingCount = computed(() => this.data()?.pendingCount ?? 0);

    pendingAmount = computed(() => this.data()?.pendingAmount ?? 0);

    nextRunDate = computed(() => this.data()?.nextRunDate ?? '');

    approvedThisMonth = computed(() => this.data()?.approvedThisMonth ?? 0);

    rejectedThisMonth = computed(() => this.data()?.rejectedThisMonth ?? 0);

    averageAmount = computed(() => {
        const count = this.pendingCount();
        return count === 0 ? 0 : this.pendingAmount() / count;
    });

    menuItems = signal([
        {
            label: 'Options',
            items: [
                { label: 'Refresh', icon: 'pi pi-refresh' },
                { label: 'Export', icon: 'pi pi-upload' }
            ]
        }
    ]);

    formatCurrency(value: number, currency: string = this.currency()): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(value);
    }
}
