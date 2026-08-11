import { Component, computed, inject, input, output, viewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { LayoutService } from '../../../../layout/service/layout.service';
import { tooltip } from './tooltip';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';

export interface BarChartDataset {
    label?: string;
    data: number[] | { x: string; y: number }[];
    backgroundColor?: string;
    borderRadius?: number;
    borderSkipped?: boolean;
    maxBarThickness?: number;
    hideInLegendAndTooltip?: boolean;
    fill?: boolean;
}

export interface BarClickData {
    index: number;
    label: any;
    value: number | { x: string; y: number };
    x: number;
    y: number;
    datasetIndex: number;
    active: number | null;
}

function getColor(variable: string, opacity: number = 1): string {
    const rootStyles = getComputedStyle(document.documentElement);
    const colorValue = rootStyles.getPropertyValue(`--p-${variable}`).trim() || rootStyles.getPropertyValue(`--${variable}`).trim();

    if (colorValue.startsWith('#')) {
        const hex = colorValue.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    if (colorValue.startsWith('rgb')) {
        if (opacity < 1) {
            const rgbMatch = colorValue.match(/\d+/g);
            if (rgbMatch) {
                return `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
            }
        }
        return colorValue;
    }

    return colorValue || variable;
}

@Component({
    selector: '[bar-chart]',
    standalone: true,
    imports: [UIChart],
    template: `
        <div class="w-full h-full overflow-auto">
            <p-chart #chartRef type="bar" [data]="chartData()" [options]="chartOptions()" [class]="chartClass()" />
        </div>
    `
})
export class BarChart {
    private layoutService = inject<any>(LayoutService);

    chartRef = viewChild<UIChart>('chartRef');

    styleClass = input<string>('');
    datasets = input<BarChartDataset[]>([]);
    labels = input<any[]>([]);
    valueFormatter = input<(value: any) => string>((value) => `${value}`);
    showYAxis = input<boolean>(true);
    xLabelFormatter = input<(value: any) => string>((value) => format(value, 'MMM'));
    yLabelFormatter = input<(value: any) => string | number>((value) => value);
    tooltipTitleFormatter = input<(value: any) => string>((value) => {
        const date = new Date(value);
        return format(date, 'MMMM yyyy');
    });
    stacked = input<boolean>(true);
    showYGrid = input<boolean>(false);
    showXGrid = input<boolean>(false);
    beginAtZero = input<boolean>(true);
    yStepSize = input<number | null>(null);
    categoryPercentage = input<number>(0.7);

    barClick = output<BarClickData>();

    chartClass = computed(() => `w-full cursor-pointer min-h-72 min-w-[600px] pb-2 overflow-hidden ${this.styleClass()}`);

    private isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    private _activeBarIndex: number | null = null;

    chartData = computed(() => {
        const self = this;
        const datasets = this.datasets().map((dataset) => ({
            hideInLegendAndTooltip: dataset.hideInLegendAndTooltip ?? false,
            borderRadius: dataset.borderRadius ?? 6,
            borderSkipped: dataset.borderSkipped ?? false,
            maxBarThickness: dataset.maxBarThickness ?? 28,
            ...dataset,
            fill: dataset.fill ?? true,
            backgroundColor: (context: any) => {
                const activeIndex = self._activeBarIndex;
                if (activeIndex !== null && context.dataIndex !== activeIndex) {
                    return getColor(dataset.backgroundColor ?? 'primary-500', 0.4);
                }
                return getColor(dataset.backgroundColor ?? 'primary-500');
            },
            tooltipBackgroundColor: () => {
                return getColor(dataset.backgroundColor ?? 'primary-500');
            },
            hoverBackgroundColor: (context: any) => {
                const activeIndex = self._activeBarIndex;
                const color = getColor(dataset.backgroundColor ?? 'primary-500', 0.6);
                if (activeIndex === null) {
                    return color;
                }
                return context.dataset.backgroundColor(context);
            }
        }));

        const labels = this.labels().map((label) => label ?? '');

        return { labels, datasets };
    });

    chartOptions = computed(() => {
        const isDark = this.isDarkTheme();
        const valueFormatterFn = this.valueFormatter();
        const xLabelFormatterFn = this.xLabelFormatter();
        const yLabelFormatterFn = this.yLabelFormatter();

        return {
            barPercentage: 1,
            categoryPercentage: this.categoryPercentage(),
            interaction: {
                intersect: false,
                mode: 'index'
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 100
            },
            hover: {
                animationDuration: 0
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                tooltip: {
                    enabled: false,
                    position: 'nearest',
                    external: (context: any) => tooltip(context, valueFormatterFn, 'bar')
                },
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    stacked: this.stacked(),
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    offset: true,
                    grid: {
                        display: this.showXGrid(),
                        color: isDark ? getColor('surface-900') : getColor('surface-100')
                    },
                    ticks: {
                        color: isDark ? getColor('surface-500') : getColor('surface-400'),
                        autoSkip: true,
                        maxRotation: 0,
                        source: 'data',
                        font: {
                            size: 14,
                            family: 'Archivo'
                        },
                        callback: function (value: any) {
                            return xLabelFormatterFn(value);
                        }
                    },
                    border: {
                        display: false,
                        dash: [5, 5]
                    },
                    position: 'bottom'
                },
                y: {
                    beginAtZero: this.beginAtZero(),
                    display: this.showYAxis(),
                    stacked: this.stacked(),
                    grid: {
                        display: this.showYGrid(),
                        color: isDark ? getColor('surface-900') : getColor('surface-100')
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: this.yStepSize() ? undefined : 6,
                        stepSize: this.yStepSize() ?? undefined,
                        color: isDark ? getColor('surface-500') : getColor('surface-400'),
                        callback: function (value: any) {
                            return yLabelFormatterFn(Math.abs(value));
                        },
                        font: {
                            size: 14,
                            family: 'Archivo'
                        }
                    }
                }
            },
            onClick: (event: any, elements: any[]) => {
                if (elements.length > 0) {
                    const chart = event.chart;
                    const clickedIndex = elements[0].index;
                    const clickedElement = elements[0];

                    const barData: BarClickData = {
                        index: clickedIndex,
                        label: this.labels()[clickedIndex],
                        value: this.datasets()[clickedElement.datasetIndex].data[clickedIndex],
                        x: clickedElement.element.x,
                        y: clickedElement.element.y,
                        datasetIndex: clickedElement.datasetIndex,
                        active: this._activeBarIndex === clickedIndex ? clickedIndex : null
                    };

                    if (this._activeBarIndex === clickedIndex) {
                        this._activeBarIndex = null;
                    } else {
                        this._activeBarIndex = clickedIndex;
                    }

                    this.barClick.emit(barData);
                    chart.update('none');
                }
            }
        };
    });
}
