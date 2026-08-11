import { Component, computed, inject, input, output, signal } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { LayoutService } from '../../../../layout/service/layout.service';
import { tooltip } from './tooltip';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';

export interface LineChartDataset {
    label?: string;
    data: number[] | { x: string; y: number }[];
    borderColor?: string;
    backgroundColor?: { color: string; opacity: number }[];
}

export interface PointClickData {
    index: number;
    value: any;
    active: boolean;
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

    if (!colorValue) {
        return `rgba(100, 100, 100, ${opacity})`;
    }

    return colorValue;
}

@Component({
    selector: '[line-chart]',
    standalone: true,
    imports: [UIChart],
    template: ` <p-chart type="line" [data]="chartData()" [plugins]="chartPlugins()" [options]="chartOptions()" [class]="chartClass()" /> `
})
export class LineChart {
    private layoutService = inject<any>(LayoutService);

    styleClass = input<string>('');
    datasets = input<LineChartDataset[]>([]);
    labels = input<any[]>([]);
    valueFormatter = input<(value: any) => string>((value) => `${value}`);
    showYAxis = input<boolean>(false);
    xLabelFormatter = input<(value: any) => string>((value) => format(value, 'MMM'));
    yLabelFormatter = input<(value: any) => string | number>((value) => value);
    tooltipTitleFormatter = input<(value: any) => string>((value) => {
        const date = new Date(value);
        return format(date, 'MMMM yyyy');
    });
    borderColor = input<string | null>(null);
    area = input<boolean>(false);
    showYGrid = input<boolean>(false);
    showXGrid = input<boolean>(true);
    beginAtZero = input<boolean>(true);
    tension = input<number>(0.3);
    borderWidth = input<number>(1.2);
    showPoints = input<boolean>(false);
    minY = input<number>(0);
    maxY = input<number | null>(null);
    showXBorder = input<boolean>(false);
    showYBorder = input<boolean>(false);
    yStepSize = input<number | null>(null);

    pointClick = output<PointClickData>();

    activePointIndex = signal<number | null>(null);

    chartClass = computed(() => `h-full w-full cursor-pointer ${this.styleClass()}`);

    private isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    chartPlugins = computed(() => {
        const isDark = this.isDarkTheme();
        const bWidth = this.borderWidth();

        const hoverLine = {
            id: 'hoverLine',
            afterDraw: (chart: any) => {
                const { ctx, tooltip, chartArea } = chart;

                if (!tooltip || tooltip.opacity === 0) return;

                const x = tooltip.caretX;
                if (!x) return;

                const { top, bottom } = chartArea;

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = bWidth;
                ctx.strokeStyle = getColor(isDark ? 'surface-500' : 'surface-400');
                ctx.setLineDash([4, 4]);
                ctx.moveTo(x, top);
                ctx.lineTo(x, bottom);
                ctx.stroke();
                ctx.restore();
            }
        };

        return [hoverLine];
    });

    chartData = computed(() => {
        const isDark = this.isDarkTheme();
        const isArea = this.area();
        const tensionVal = this.tension();
        const bWidth = this.borderWidth();
        const showPts = this.showPoints();

        const datasets = this.datasets().map((dataset) => ({
            ...dataset,
            fill: isArea,
            tension: tensionVal,
            borderWidth: bWidth,
            pointBorderColor: showPts ? getColor(isDark ? 'surface-950' : 'surface-0') : 'rgba(0,0,0,0)',
            pointBackgroundColor: showPts ? getColor(dataset.borderColor ?? 'primary-500') : 'rgba(0,0,0,0)',
            pointHoverBackgroundColor: getColor(dataset.borderColor ?? 'primary-500'),
            pointHoverBorderColor: getColor(isDark ? 'surface-950' : 'surface-0'),
            pointBorderWidth: 1.5,
            pointStyle: 'rect',
            pointRadius: 5,
            pointHoverRadius: 5,
            borderColor: getColor(dataset.borderColor ?? 'primary-500'),
            backgroundColor: isArea
                ? (context: any) => {
                      const defaultColor = isDark
                          ? [
                                { color: 'surface-0', opacity: 0.24 },
                                { color: 'surface-0', opacity: 0 }
                            ]
                          : [
                                { color: 'surface-950', opacity: 0.24 },
                                { color: 'surface-950', opacity: 0 }
                            ];
                      const bg = dataset.backgroundColor ?? defaultColor;

                      if (!context.chart.chartArea) return;

                      const {
                          ctx,
                          chartArea: { top, bottom }
                      } = context.chart;
                      const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                      const colorTranches = 1 / (bg.length - 1);

                      bg.forEach((item: { color: string; opacity: number }, index: number) => {
                          gradientBg.addColorStop(index * colorTranches, getColor(item.color, item.opacity));
                      });

                      return gradientBg;
                  }
                : undefined
        }));

        return {
            labels: this.labels(),
            datasets
        };
    });

    chartOptions = computed(() => {
        const isDark = this.isDarkTheme();
        const valueFormatterFn = this.valueFormatter();
        const xLabelFormatterFn = this.xLabelFormatter();
        const yLabelFormatterFn = this.yLabelFormatter();
        const bWidth = this.borderWidth();

        return {
            interaction: {
                intersect: false,
                mode: 'nearest',
                axis: 'x'
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            hover: {
                animationDuration: 0,
                mode: 'nearest',
                intersect: false,
                axis: 'x'
            },
            responsiveAnimationDuration: 0,
            elements: {
                point: {
                    radius: 4,
                    hitRadius: 4,
                    hoverRadius: 4,
                    hoverBorderWidth: 2,
                    transition: 0
                }
            },
            layout: {
                padding: 0
            },
            plugins: {
                tooltip: {
                    enabled: false,
                    position: 'nearest',
                    external: (context: any) => tooltip(context, valueFormatterFn, 'line')
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
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    grid: {
                        display: this.showXGrid(),
                        color: isDark ? getColor('surface-800') : getColor('surface-200'),
                        lineWidth: bWidth
                    },
                    ticks: {
                        color: isDark ? getColor('surface-500') : getColor('surface-400'),
                        padding: 2,
                        autoSkip: false,
                        maxRotation: 0,
                        source: 'auto',
                        font: {
                            size: 14,
                            family: 'Archivo'
                        },
                        callback: function (value: any) {
                            return xLabelFormatterFn(value);
                        }
                    },
                    border: {
                        display: this.showXBorder()
                    }
                },
                y: {
                    beginAtZero: this.beginAtZero(),
                    display: this.showYAxis(),
                    min: this.minY(),
                    max: this.maxY() ?? undefined,
                    grid: {
                        display: this.showYGrid(),
                        color: isDark ? getColor('surface-800') : getColor('surface-200'),
                        lineWidth: bWidth
                    },
                    ticks: {
                        color: isDark ? getColor('surface-500') : getColor('surface-400'),
                        stepSize: this.yStepSize() ?? undefined,
                        callback: function (value: any) {
                            return yLabelFormatterFn(value);
                        },
                        font: {
                            size: 14,
                            family: 'Archivo'
                        }
                    },
                    border: {
                        display: this.showYBorder()
                    }
                }
            },
            onClick: (event: any, elements: any[]) => {
                if (elements.length > 0) {
                    const clickedIndex = elements[0].index;
                    const isActive = this.activePointIndex() === clickedIndex;
                    this.activePointIndex.set(isActive ? null : clickedIndex);

                    this.pointClick.emit({
                        index: clickedIndex,
                        value: this.datasets()[elements[0].datasetIndex].data[clickedIndex],
                        active: !isActive
                    });
                }
            }
        };
    });
}
