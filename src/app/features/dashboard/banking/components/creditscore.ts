import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { CashBreakdown } from '@app/core/models';

@Component({
    selector: '[credit-score]',
    standalone: true,
    imports: [CommonModule, CustomCard, ButtonModule, Menu],
    template: `
        <div custom-card>
            <h3 card-title>Cash Flow Breakdown</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div class="p-4 flex flex-col">
                <div class="flex items-center gap-4">
                    <div class="bg-primary w-12 h-12 flex items-center justify-center rounded-2xl shadow-[0px_-1px_1px_0px_rgba(0,0,0,0.04)_inset,0px_1px_1px_0px_rgba(0,0,0,0.04)_inset]">
                        <i class="pi pi-wallet text-primary-contrast !text-xl"></i>
                    </div>
                    <div class="flex-1">
                        <div class="text-xl font-medium">Net cash flow {{ formatCurrency(netCashFlow()) }}</div>
                        <div class="mt-1 text-sm text-surface-500">Receivables and payables of the current period.</div>
                    </div>
                </div>
                <div class="mt-8 flex-1">
                    <div class="flex justify-between h-full gap-2">
                        @for (item of slices(); track item.title) {
                            <div class="flex-1 flex flex-col h-full items-center">
                                <div class="min-h-32 h-full w-full max-w-10 bg-surface-50 dark:bg-surface-900 rounded-lg flex flex-col items-center justify-end">
                                    <div
                                        class="group cursor-pointer relative w-full rounded-[inherit] hover:opacity-75 transition-opacity duration-150"
                                        [style.backgroundColor]="item.color"
                                        [style.height]="barHeight(item.value) + 'px'"
                                    >
                                        <span class="group-hover:opacity-100 opacity-0 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 -top-7 text-xs font-medium bg-surface-50 dark:bg-slate-900 border rounded-md px-1.5 py-0.5">
                                            {{ formatCurrency(item.value) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="text-xs font-medium mt-2">{{ item.title }}</div>
                            </div>
                        } @empty {
                            <div class="w-full text-surface-500 text-center py-10">No cash movement recorded</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    host: {
        class: 'rounded-2xl flex flex-col overflow-hidden col-span-12 xl:col-span-4 row-span-1'
    }
})
export class CreditScore {
    data = input<CashBreakdown | null>(null);

    currency = input<string>('USD');

    slices = computed(() => this.data()?.slices ?? []);

    netCashFlow = computed(() => this.data()?.netCashFlow ?? 0);

    maxSliceValue = computed(() => this.slices().reduce((max, slice) => Math.max(max, slice.value), 0));

    menuItems = signal([
        {
            label: 'Options',
            items: [
                { label: 'Refresh', icon: 'pi pi-refresh' },
                { label: 'Export', icon: 'pi pi-upload' }
            ]
        }
    ]);

    barHeight(value: number): number {
        const max = this.maxSliceValue();
        return max === 0 ? 0 : Math.round((value / max) * 120);
    }

    formatCurrency(value: number, currency: string = this.currency()): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(value);
    }
}
