import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { BarChart, BarChartDataset } from '../../../../shared/components/ui/charts/barchart';
import { ChartUpIcon, ChartDownIcon } from '../icons';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { FinanceOverview, FinanceOverviewPeriod } from '@app/core/models';

interface PeriodOption {
    name: string;
    value: string;
}

interface ChartLegendItem {
    label: string;
    icon: 'up' | 'down';
    value: number;
    increase: boolean;
    percent: number;
    iconClass: string;
}

@Component({
    selector: '[overview]',
    standalone: true,
    imports: [CommonModule, CustomCard, BarChart, ChartUpIcon, ChartDownIcon, ButtonModule, Menu, Tag, SelectButton, FormsModule],
    template: `
        <div custom-card>
            <h3 card-title>Revenue vs Expenses</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div class="flex flex-col">
                <div class="p-5 flex items-start justify-between md:flex-row flex-col-reverse gap-4">
                    <div>
                        <div class="flex items-center gap-4">
                            <div class="text-4xl font-semibold">{{ formatCurrency(netIncome()) }}</div>
                            <p-tag [severity]="netIncome() >= 0 ? 'success' : 'danger'" [value]="marginPercent() + '%'" />
                        </div>
                        <div class="mt-2 flex items-center gap-1">
                            <span class="text-surface-500">Net income on</span>
                            <span class="font-medium">{{ formatCurrency(totalRevenue()) }} revenue</span>
                        </div>
                    </div>
                    <p-selectbutton [(ngModel)]="selectedPeriod" [options]="periodOptions()" optionLabel="name" [allowEmpty]="false" />
                </div>
                <div class="flex-1 p-4 max-h-80">
                    <div
                        bar-chart
                        [datasets]="chartData()"
                        [stacked]="false"
                        [valueFormatter]="valueFormatter"
                        [xLabelFormatter]="xLabelFormatter"
                        [yLabelFormatter]="yLabelFormatter"
                        [showYGrid]="true"
                        [showXGrid]="true"
                        [beginAtZero]="true"
                    ></div>
                </div>
                <div class="p-5 flex gap-10 border-t md:flex-row flex-col">
                    @for (item of chartLegend(); track item.label; let last = $last) {
                        <div class="sm:flex-1 flex items-center gap-4">
                            <div class="w-14 h-14 flex items-center justify-center rounded-xl shadow-stroke" [class]="item.iconClass">
                                @if (item.icon === 'up') {
                                    <chart-up-icon />
                                } @else {
                                    <chart-down-icon />
                                }
                            </div>
                            <div class="flex-1 flex flex-col">
                                <span class="text-surface-500">{{ item.label }}</span>
                                <div class="flex items-center gap-1">
                                    <span class="text-xl font-semibold">{{ formatCurrency(item.value) }}</span>
                                    <i class="pi !text-sm" [class]="item.increase ? 'text-green-600 pi-arrow-up-right' : 'text-orange-600 pi-arrow-down-right'"></i>
                                    <span class="font-medium" [class]="item.increase ? 'text-green-600' : 'text-orange-600'">{{ item.percent }}%</span>
                                </div>
                            </div>
                        </div>
                        @if (!last) {
                            <div class="md:w-px w-full md:h-full h-px bg-surface-200 dark:bg-surface-800"></div>
                        }
                    }
                </div>
            </div>
        </div>
    `,
    host: {
        class: 'col-span-12 xl:col-span-8 row-span-1'
    }
})
export class Overview {
    data = input<FinanceOverview | null>(null);

    currency = input<string>('USD');

    selectedPeriod = signal<PeriodOption | null>(null);

    periodOptions = computed<PeriodOption[]>(() => (this.data()?.periods ?? []).map((period) => ({ name: period.label, value: period.key })));

    currentPeriod = computed<FinanceOverviewPeriod | null>(() => {
        const periods = this.data()?.periods ?? [];
        if (periods.length === 0) {
            return null;
        }
        const selected = this.selectedPeriod()?.value ?? this.data()?.selectedPeriod;
        return periods.find((period) => period.key === selected) ?? periods[periods.length - 1];
    });

    totalRevenue = computed(() => this.sum(this.currentPeriod()?.revenue));

    totalExpenses = computed(() => this.sum(this.currentPeriod()?.expenses));

    totalBudget = computed(() => this.sum(this.currentPeriod()?.budget));

    netIncome = computed(() => this.totalRevenue() - this.totalExpenses());

    marginPercent = computed(() => {
        const revenue = this.totalRevenue();
        return revenue === 0 ? 0 : Math.round((this.netIncome() * 1000) / revenue) / 10;
    });

    chartData = computed<BarChartDataset[]>(() => {
        const period = this.currentPeriod();
        if (!period) {
            return [];
        }
        return [
            { label: 'Revenue', data: this.toPoints(period.revenue), backgroundColor: 'green-600' },
            { label: 'Expenses', data: this.toPoints(period.expenses), backgroundColor: 'orange-600' },
            { label: 'Budget', data: this.toPoints(period.budget), backgroundColor: 'primary-500' }
        ];
    });

    chartLegend = computed<ChartLegendItem[]>(() => {
        const budget = this.totalBudget();
        const expenses = this.totalExpenses();
        const revenue = this.totalRevenue();
        const consumption = budget === 0 ? 0 : Math.round((expenses * 1000) / budget) / 10;

        return [
            {
                label: 'Revenue',
                icon: 'up',
                value: revenue,
                increase: true,
                percent: this.marginPercent(),
                iconClass: '[&_svg]:fill-green-600'
            },
            {
                label: 'Expenses',
                icon: 'down',
                value: expenses,
                increase: expenses <= budget,
                percent: consumption,
                iconClass: '[&_svg]:fill-orange-600'
            }
        ];
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

    valueFormatter = (value: any) => `$${Number(value).toLocaleString()}`;
    yLabelFormatter = (value: any) => (value >= 1000 ? `${Math.round(value / 1000)}K` : value);
    xLabelFormatter = (value: any) => {
        const labels = this.currentPeriod()?.labels ?? [];
        return labels[new Date(value).getUTCMonth()] ?? '';
    };

    formatCurrency(value: number, currency: string = this.currency()): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(value);
    }

    private sum(values?: number[]): number {
        return (values ?? []).reduce((total, value) => total + value, 0);
    }

    private toPoints(values: number[]): { x: string; y: number }[] {
        return values.map((value, index) => ({ x: `2024-${String(index + 1).padStart(2, '0')}-01`, y: value }));
    }
}
