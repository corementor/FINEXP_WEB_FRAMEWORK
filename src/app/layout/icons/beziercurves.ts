import { Component, input } from '@angular/core';

@Component({
    selector: 'bezier-curves',
    standalone: true,
    template: `
        <svg [class]="styleClass()" class="fill-surface-950 dark:fill-surface-0" xmlns="http://www.w3.org/2000/svg" width="40" height="46" viewBox="0 0 40 46" fill="none">
            <g filter="url(#filter0_dddd_6191_553)">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.58333 5C7.05203 5 5 7.05203 5 9.58333V30.4167C5 32.948 7.05203 35 9.58333 35H30.4167C32.948 35 35 32.948 35 30.4167V9.58333C35 7.05203 32.948 5 30.4167 5H9.58333ZM26.9945 11.6667C24.7617 11.6672 23.1342 12.8386 21.8995 14.3356C20.7132 15.7741 19.776 17.651 18.9195 19.3663L18.8817 19.4422C17.98 21.248 17.1587 22.8782 16.1718 24.0747C15.2157 25.2337 14.2301 25.8333 13.0052 25.8333H12.9167C12.2263 25.8333 11.6667 26.393 11.6667 27.0833C11.6667 27.7737 12.2263 28.3333 12.9167 28.3333H13.0052C15.2381 28.3333 16.8657 27.1623 18.1003 25.6655C19.2868 24.227 20.2242 22.35 21.0807 20.6345L21.1183 20.5592C22.02 18.7533 22.8413 17.123 23.8283 15.9262C24.7843 14.7669 25.77 14.1671 26.9948 14.1667H27.0833C27.7737 14.1667 28.3333 13.607 28.3333 12.9167C28.3333 12.2263 27.7737 11.6667 27.0833 11.6667H26.9945Z"
                />
            </g>
            <defs>
                <filter id="filter0_dddd_6191_553" x="-3" y="-1" width="46" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6191_553" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_6191_553" result="effect2_dropShadow_6191_553" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="effect2_dropShadow_6191_553" result="effect3_dropShadow_6191_553" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
                    <feBlend mode="normal" in2="effect3_dropShadow_6191_553" result="effect4_dropShadow_6191_553" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_6191_553" result="shape" />
                </filter>
            </defs>
        </svg>
    `
})
export class BezierCurves {
    styleClass = input<string>('', { alias: 'class' });
}
