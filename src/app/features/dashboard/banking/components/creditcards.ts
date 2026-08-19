import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { BudgetExecution } from '@app/core/models';

@Component({
    selector: '[credit-cards]',
    standalone: true,
    imports: [CommonModule, FormsModule, CustomCard, ButtonModule, Menu, Tag],
    template: `
        <div custom-card>
            <h3 card-title>Budget Execution by Cost Center</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div class="p-5">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-surface-500 text-sm">Total allocated</div>
                        <div class="text-2xl font-semibold mt-1">{{ formatCurrency(totalAllocated()) }}</div>
                    </div>
                    <p-tag [severity]="totalUtilization() > 90 ? 'danger' : 'success'" [value]="totalUtilization() + '% used'" />
                </div>
                <div class="mt-6 flex flex-col gap-5">
                    @for (item of data(); track item.code) {
                        <div>
                            <div class="flex items-center justify-between">
                                <div class="flex flex-col">
                                    <span class="font-medium">{{ item.costCenter }}</span>
                                    <span class="text-surface-500 text-sm">{{ item.code }}</span>
                                </div>
                                <div class="text-right">
                                    <div class="font-medium">{{ formatCurrency(item.consumed) }}</div>
                                    <div class="text-surface-500 text-sm">of {{ formatCurrency(item.allocated) }}</div>
                                </div>
                            </div>
                            <div class="mt-2 h-1.5 w-full rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
                                <div class="h-full rounded-full" [class]="item.utilizationPercent > 90 ? 'bg-red-600' : 'bg-primary'" [style.width]="barWidth(item) + '%'"></div>
                            </div>
                            <div class="mt-2 flex items-center justify-between text-sm">
                                <span class="text-surface-500">Committed {{ formatCurrency(item.committed) }}</span>
                                <span class="font-medium" [class]="item.utilizationPercent > 90 ? 'text-red-600' : 'text-green-600'">{{ item.utilizationPercent }}%</span>
                            </div>
                        </div>
                    } @empty {
                        <div class="text-surface-500 text-center py-6">No budget allocation available</div>
                    }
                </div>
            </div>
        </div>
    `,
    host: {
        class: 'col-span-12 xl:col-span-4 row-span-2'
    }
})
export class CreditCards {
    data = input<BudgetExecution[]>([]);

    currency = input<string>('USD');

    totalAllocated = computed(() => this.data().reduce((total, item) => total + item.allocated, 0));

    totalConsumed = computed(() => this.data().reduce((total, item) => total + item.consumed, 0));

    totalUtilization = computed(() => {
        const allocated = this.totalAllocated();
        return allocated === 0 ? 0 : Math.round((this.totalConsumed() * 1000) / allocated) / 10;
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

    barWidth(item: BudgetExecution): number {
        return Math.min(Math.max(item.utilizationPercent, 0), 100);
    }

    formatCurrency(value: number, currency: string = this.currency()): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(value);
    }
}
