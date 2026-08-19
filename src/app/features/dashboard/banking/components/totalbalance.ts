import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { CashPosition } from '@app/core/models';

@Component({
    selector: '[total-balance]',
    standalone: true,
    imports: [CommonModule, Tag],
    template: `
        <div>
            <div class="text-2xl text-primary-contrast">{{ label() }}</div>
            <div class="mt-4 flex items-center gap-2">
                <div class="text-4xl text-primary-contrast font-semibold">{{ formatCurrency(totalCash(), currency()) }}</div>
                <p-tag [severity]="increase() ? 'success' : 'danger'" [value]="changePercent() + '%'" />
            </div>
            <div class="mt-2 flex items-center gap-2">
                <span class="text-white/70 dark:text-primary-contrast">Compared to last month</span>
                <span class="font-medium" [class]="increase() ? 'text-green-400' : 'text-red-400'">{{ formatCurrency(comparedToLastMonth(), currency()) }}</span>
            </div>
        </div>
        <div class="lg:block hidden absolute -top-2 -bottom-0 right-0 z-10">
            <svg class="h-full w-auto" width="350" height="146" viewBox="0 0 350 146" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_dddddddd_6308_222210)">
                    <path
                        d="M222.944 74.4876C202.99 74.4876 183.232 78.2812 164.797 85.6518C146.363 93.0224 129.613 103.826 115.503 117.445C101.394 131.064 90.2019 147.232 82.5661 165.026C74.9302 182.821 71 201.892 71 221.153C71 240.413 74.9302 259.485 82.5661 277.279C90.202 295.073 101.394 311.241 115.503 324.86C129.613 338.479 146.363 349.283 164.798 356.653C183.232 364.024 202.99 367.818 222.944 367.818L222.944 74.4876Z"
                        fill="url(#paint0_linear_6308_222210)"
                        fill-opacity="0.9"
                        shape-rendering="crispEdges"
                    />
                </g>
                <g filter="url(#filter1_dddddddd_6308_222210)">
                    <path
                        d="M227.056 312.08C247.01 312.08 266.768 308.286 285.203 300.916C303.637 293.545 320.387 282.742 334.497 269.123C348.606 255.504 359.798 239.336 367.434 221.541C375.07 203.747 379 184.675 379 165.415C379 146.155 375.07 127.083 367.434 109.289C359.798 91.4946 348.606 75.3264 334.497 61.7073C320.387 48.0882 303.637 37.2849 285.203 29.9143C266.768 22.5437 247.01 18.7501 227.056 18.7501L227.056 312.08Z"
                        fill="url(#paint1_linear_6308_222210)"
                        fill-opacity="0.9"
                        shape-rendering="crispEdges"
                    />
                </g>
                <defs>
                    <filter id="filter0_dddddddd_6308_222210" x="0.177345" y="50.8801" width="293.589" height="434.975" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="0.590189" />
                        <feGaussianBlur stdDeviation="0.590189" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                        <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="1.18038" />
                        <feGaussianBlur stdDeviation="0.885284" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                        <feBlend mode="color-burn" in2="effect1_dropShadow_6308_222210" result="effect2_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.36076" />
                        <feGaussianBlur stdDeviation="2.36076" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                        <feBlend mode="color-burn" in2="effect2_dropShadow_6308_222210" result="effect3_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4.72151" />
                        <feGaussianBlur stdDeviation="3.54113" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                        <feBlend mode="color-burn" in2="effect3_dropShadow_6308_222210" result="effect4_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="9.44303" />
                        <feGaussianBlur stdDeviation="7.08227" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                        <feBlend mode="color-burn" in2="effect4_dropShadow_6308_222210" result="effect5_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="14.1645" />
                        <feGaussianBlur stdDeviation="9.44303" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                        <feBlend mode="color-burn" in2="effect5_dropShadow_6308_222210" result="effect6_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dx="-9.44303" dy="33.0506" />
                        <feGaussianBlur stdDeviation="18.8861" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                        <feBlend mode="plus-darker" in2="effect6_dropShadow_6308_222210" result="effect7_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="47.2151" />
                        <feGaussianBlur stdDeviation="35.4113" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                        <feBlend mode="plus-darker" in2="effect7_dropShadow_6308_222210" result="effect8_dropShadow_6308_222210" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect8_dropShadow_6308_222210" result="shape" />
                    </filter>
                    <filter id="filter1_dddddddd_6308_222210" x="156.233" y="-4.85744" width="293.589" height="434.975" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="0.590189" />
                        <feGaussianBlur stdDeviation="0.590189" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                        <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="1.18038" />
                        <feGaussianBlur stdDeviation="0.885284" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                        <feBlend mode="color-burn" in2="effect1_dropShadow_6308_222210" result="effect2_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.36076" />
                        <feGaussianBlur stdDeviation="2.36076" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                        <feBlend mode="color-burn" in2="effect2_dropShadow_6308_222210" result="effect3_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4.72151" />
                        <feGaussianBlur stdDeviation="3.54113" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                        <feBlend mode="color-burn" in2="effect3_dropShadow_6308_222210" result="effect4_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="9.44303" />
                        <feGaussianBlur stdDeviation="7.08227" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                        <feBlend mode="color-burn" in2="effect4_dropShadow_6308_222210" result="effect5_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="14.1645" />
                        <feGaussianBlur stdDeviation="9.44303" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                        <feBlend mode="color-burn" in2="effect5_dropShadow_6308_222210" result="effect6_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dx="-9.44303" dy="33.0506" />
                        <feGaussianBlur stdDeviation="18.8861" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                        <feBlend mode="plus-darker" in2="effect6_dropShadow_6308_222210" result="effect7_dropShadow_6308_222210" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="47.2151" />
                        <feGaussianBlur stdDeviation="35.4113" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                        <feBlend mode="plus-darker" in2="effect7_dropShadow_6308_222210" result="effect8_dropShadow_6308_222210" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect8_dropShadow_6308_222210" result="shape" />
                    </filter>
                    <linearGradient id="paint0_linear_6308_222210" x1="45.7577" y1="23.2792" x2="283.537" y2="140.488" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" stop-opacity="0.92" />
                        <stop offset="1" stop-color="white" stop-opacity="0.64" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_6308_222210" x1="404.242" y1="363.288" x2="166.463" y2="246.079" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" stop-opacity="0.92" />
                        <stop offset="1" stop-color="white" stop-opacity="0.64" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    `,
    host: {
        class: 'relative overflow-hidden col-span-12 px-8 py-6 rounded-2xl bg-primary'
    }
})
export class TotalBalance {
    data = input<CashPosition | null>(null);

    label(): string {
        return this.data()?.label ?? 'Total Cash Position';
    }

    totalCash(): number {
        return this.data()?.totalCash ?? 0;
    }

    changePercent(): number {
        return this.data()?.changePercent ?? 0;
    }

    increase(): boolean {
        return this.data()?.increase ?? true;
    }

    comparedToLastMonth(): number {
        return this.data()?.comparedToLastMonth ?? 0;
    }

    currency(): string {
        return this.data()?.currency ?? 'USD';
    }

    formatCurrency(value: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(value);
    }
}
