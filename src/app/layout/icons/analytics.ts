import { Component, input } from '@angular/core';

@Component({
    selector: 'analytics',
    standalone: true,
    template: `
        <svg [class]="styleClass()" class="fill-surface-950 dark:fill-surface-0" xmlns="http://www.w3.org/2000/svg" width="40" height="46" viewBox="0 0 40 46" fill="none">
            <g filter="url(#filter0_dddd_6191_550)">
                <path
                    d="M5 9.58333C5 7.05203 7.05203 5 9.58333 5H30.4167C32.948 5 35 7.05203 35 9.58333V18.75H27.836L24.438 12.3318C24.2165 11.9132 23.7773 11.6559 23.304 11.667C22.8305 11.6781 22.404 11.9559 22.2023 12.3844L16.6009 24.2875L14.0214 19.4152C13.8048 19.006 13.3797 18.75 12.9167 18.75H5V9.58333Z"
                />
                <path
                    d="M5 21.25V30.4167C5 32.948 7.05203 35 9.58333 35H30.4167C32.948 35 35 32.948 35 30.4167V21.25H27.0833C26.6203 21.25 26.1952 20.994 25.9787 20.5848L23.3992 15.7125L17.7977 27.6155C17.596 28.0442 17.1695 28.3218 16.696 28.333C16.2226 28.3442 15.7835 28.0867 15.5619 27.6682L12.1641 21.25H5Z"
                />
            </g>
            <defs>
                <filter id="filter0_dddd_6191_550" x="2" y="4" width="36" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6191_550" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_6191_550" result="effect2_dropShadow_6191_550" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="effect2_dropShadow_6191_550" result="effect3_dropShadow_6191_550" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
                    <feBlend mode="normal" in2="effect3_dropShadow_6191_550" result="effect4_dropShadow_6191_550" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_6191_550" result="shape" />
                </filter>
            </defs>
        </svg>
    `
})
export class Analytics {
    styleClass = input<string>('', { alias: 'class' });
}
