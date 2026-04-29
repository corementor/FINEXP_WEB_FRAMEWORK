import { Component, input } from '@angular/core';

@Component({
    selector: 'chart-down',
    standalone: true,
    template: `
        <svg [class]="styleClass()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g filter="url(#filter0_ii_6308_222371)">
                <path
                    d="M6.5 3.00098C7.3284 3.00098 8 3.67255 8 4.50098V19.5H9.5V10.001C9.5 9.17255 10.1716 8.50098 11 8.50098H13C13.8284 8.50098 14.5 9.17255 14.5 10.001V19.5H16V15.501C16 14.6725 16.6716 14.001 17.5 14.001H19.5C20.3284 14.001 21 14.6725 21 15.501V19.5H22.25C22.6642 19.5 23 19.8358 23 20.25C23 20.6642 22.6642 21 22.25 21H1.75C1.3358 21 1 20.6642 1 20.25C1 19.8358 1.3358 19.5 1.75 19.5H3V4.50098C3 3.67255 3.6716 3.00098 4.5 3.00098H6.5Z"
                />
            </g>
            <defs>
                <filter id="filter0_ii_6308_222371" x="1" y="2.00098" width="22" height="19.999" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_6308_222371" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-1" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="normal" in2="effect1_innerShadow_6308_222371" result="effect2_innerShadow_6308_222371" />
                </filter>
            </defs>
        </svg>
    `
})
export class ChartDown {
    styleClass = input<string>('', { alias: 'class' });
}
