import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { FinanceKpi } from '@app/core/models';

@Component({
    selector: '[currency-change]',
    standalone: true,
    imports: [CommonModule, CustomCard, ButtonModule, Menu, Tag],
    template: `
        <div custom-card>
            <h3 card-title>{{ data().label }}</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div class="p-5">
                <div class="flex items-center gap-4">
                    <div class="text-2xl font-semibold">{{ formatCurrency(data().value, currency()) }}</div>
                    <p-tag [severity]="data().increase ? 'success' : 'danger'" [value]="data().changePercent + '%'" />
                </div>
                <div class="mt-2 flex items-center gap-1 text-sm">
                    <div class="text-surface-500">Compared to last month</div>
                    <div [class]="data().increase ? 'text-green-600' : 'text-red-600'">{{ formatCurrency(data().comparedToLastMonth, currency(), 2) }}</div>
                </div>
            </div>
        </div>
    `,
    host: {
        class: 'rounded-2xl flex flex-col overflow-hidden'
    }
})
export class CurrencyChange {
    data = input.required<FinanceKpi>();

    currency = input<string>('USD');

    menuItems = signal([
        {
            label: 'Options',
            items: [
                { label: 'Refresh', icon: 'pi pi-refresh' },
                { label: 'Export', icon: 'pi pi-upload' }
            ]
        }
    ]);

    formatCurrency(value: number, currency: string = 'USD', minimumFractionDigits: number = 2): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits
        }).format(value);
    }
}
