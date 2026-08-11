import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { BarChart, BarChartDataset } from '../../../../shared/components/ui/charts/barchart';
import { ChartUpIcon, ChartDownIcon } from '../icons';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

interface TimeData {
    value: number;
    from: number;
    increase: boolean;
    percent: number;
}

interface ChartLegendItem {
    label: string;
    backgroundColor: string;
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
            <h3 card-title>Overview</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div class="flex flex-col">
                <div class="p-5 flex items-start justify-between md:flex-row flex-col-reverse gap-4">
                    <div>
                        <div class="flex items-center gap-4">
                            <div class="text-4xl font-semibold">{{ formatCurrency(currentData().value) }}</div>
                            <p-tag [severity]="currentData().increase ? 'success' : 'danger'" [value]="currentData().percent + '%'" />
                        </div>
                        <div class="mt-2 flex items-center gap-1">
                            <span class="text-surface-500">From</span>
                            <span class="font-medium" [class]="currentData().increase ? 'text-green-600' : 'text-red-600'">{{ formatCurrency(currentData().from) }}</span>
                        </div>
                    </div>
                    <p-selectbutton [(ngModel)]="selectedTime" [options]="timeOptions()" optionLabel="name" />
                </div>
                <div class="flex-1 p-4 max-h-80">
                    <div bar-chart [datasets]="chartData()" [valueFormatter]="valueFormatter" [yLabelFormatter]="yLabelFormatter" [showYGrid]="true" [showXGrid]="true" [beginAtZero]="true"></div>
                </div>
                <div class="p-5 flex gap-10 border-t md:flex-row flex-col">
                    @for (item of chartLegend(); track item.label; let i = $index; let last = $last) {
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
    data = signal<Record<string, TimeData>>({
        week: { value: 278942.12, from: 48157.94, increase: true, percent: 4 },
        month: { value: 228942.12, from: 38157.94, increase: true, percent: 40 },
        year: { value: 328942.12, from: 128157.94, increase: true, percent: 18 }
    });

    selectedTime = signal({ name: 'Weekly', value: 'week' });
    timeOptions = signal([
        { name: 'Weekly', value: 'week' },
        { name: 'Monthly', value: 'month' },
        { name: 'Yearly', value: 'year' }
    ]);

    currentData = computed(() => this.data()[this.selectedTime().value]);

    chartData = signal<BarChartDataset[]>([
        {
            label: 'Income',
            data: [
                { x: '2024-01-01', y: 10000 },
                { x: '2024-02-01', y: 19000 },
                { x: '2024-03-01', y: 12000 },
                { x: '2024-04-01', y: 15000 },
                { x: '2024-05-01', y: 3000 },
                { x: '2024-06-01', y: 16000 },
                { x: '2024-07-01', y: 4000 },
                { x: '2024-08-01', y: 8000 },
                { x: '2024-09-01', y: 17000 },
                { x: '2024-10-01', y: 12000 },
                { x: '2024-11-01', y: 10000 },
                { x: '2024-12-01', y: 10000 }
            ]
        },
        {
            label: 'Expenses',
            data: [
                { x: '2024-01-01', y: -12000 },
                { x: '2024-02-01', y: -6000 },
                { x: '2024-03-01', y: -17000 },
                { x: '2024-04-01', y: -15000 },
                { x: '2024-05-01', y: -8000 },
                { x: '2024-06-01', y: -14000 },
                { x: '2024-07-01', y: -4000 },
                { x: '2024-08-01', y: -12000 },
                { x: '2024-09-01', y: -10000 },
                { x: '2024-10-01', y: -17000 },
                { x: '2024-11-01', y: -4000 },
                { x: '2024-12-01', y: -15000 }
            ],
            backgroundColor: 'orange-600'
        }
    ]);

    chartLegend = signal<ChartLegendItem[]>([
        {
            label: 'Income',
            backgroundColor: 'blue-600',
            icon: 'up',
            value: 178232.03,
            increase: true,
            percent: 52,
            iconClass: '[&_svg]:fill-blue-600'
        },
        {
            label: 'Expenses',
            backgroundColor: 'orange-600',
            icon: 'down',
            value: 59723.12,
            increase: false,
            percent: 12,
            iconClass: '[&_svg]:fill-orange-600'
        }
    ]);

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

    formatCurrency(value: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(value);
    }
}
