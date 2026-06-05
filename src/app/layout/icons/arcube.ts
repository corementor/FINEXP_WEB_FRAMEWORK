import { Component, input } from '@angular/core';

@Component({
    selector: 'ar-cube',
    standalone: true,
    template: `
        <svg [class]="styleClass()" class="fill-surface-950 dark:fill-surface-0" xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48" fill="none">
            <g filter="url(#filter0_dddd_6191_555)">
                <path
                    d="M17.7342 4.32703C19.1414 3.53551 20.8594 3.53553 22.2665 4.32703L32.6832 10.1864C33.0345 10.384 33.3535 10.6236 33.6352 10.8969L20.0014 18.5661L6.36597 10.8965C6.64764 10.6233 6.96644 10.3839 7.31752 10.1864L17.7342 4.32703Z"
                />
                <path d="M5.10814 13.0573C5.01154 13.4306 4.96094 13.8192 4.96094 14.215V25.7847C4.96094 27.4547 5.86167 28.9947 7.31715 29.8135L17.7338 35.6729C18.0588 35.8557 18.4005 35.9962 18.751 36.0947V20.7312L5.10814 13.0573Z" />
                <path d="M21.2512 36.0945C21.6011 35.9961 21.9421 35.8558 22.2664 35.6733L32.6831 29.814C34.1386 28.9951 35.0392 27.4551 35.0392 25.7851V14.2154C35.0392 13.8198 34.9887 13.4315 34.8922 13.0583L21.2512 20.7316V36.0945Z" />
            </g>
            <defs>
                <filter id="filter0_dddd_6191_555" x="-3" y="-1" width="46" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6191_555" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_6191_555" result="effect2_dropShadow_6191_555" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="effect2_dropShadow_6191_555" result="effect3_dropShadow_6191_555" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
                    <feBlend mode="normal" in2="effect3_dropShadow_6191_555" result="effect4_dropShadow_6191_555" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_6191_555" result="shape" />
                </filter>
            </defs>
        </svg>
    `
})
export class ArCube {
    styleClass = input<string>('', { alias: 'class' });
}
