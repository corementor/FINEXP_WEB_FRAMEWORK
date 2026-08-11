import { Component, input } from '@angular/core';

@Component({
    selector: 'chart-up-icon',
    standalone: true,
    template: `
        <svg [class]="styleClass()" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <g filter="url(#filter0_ii_6308_222358)">
                <path
                    d="M18 3.00098C17.1716 3.00098 16.5 3.67255 16.5 4.50098V19.5H15V10.001C15 9.17255 14.3284 8.50098 13.5 8.50098H11.5C10.6716 8.50098 10 9.17255 10 10.001V19.5H8.5V15.501C8.5 14.6725 7.82843 14.001 7 14.001H5C4.17157 14.001 3.5 14.6725 3.5 15.501V19.5H2.25C1.83579 19.5 1.5 19.8358 1.5 20.25C1.5 20.6642 1.83579 21 2.25 21H22.75C23.1642 21 23.5 20.6642 23.5 20.25C23.5 19.8358 23.1642 19.5 22.75 19.5H21.5V4.50098C21.5 3.67255 20.8284 3.00098 20 3.00098H18Z"
                />
            </g>
            <defs>
                <filter id="filter0_ii_6308_222358" x="1.5" y="2.00098" width="22" height="19.999" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_6308_222358" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-1" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="normal" in2="effect1_innerShadow_6308_222358" result="effect2_innerShadow_6308_222358" />
                </filter>
            </defs>
        </svg>
    `
})
export class ChartUpIcon {
    styleClass = input<string>('');
}
