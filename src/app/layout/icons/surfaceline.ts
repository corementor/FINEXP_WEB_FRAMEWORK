import { Component, input } from '@angular/core';

@Component({
    selector: 'surface-line',
    standalone: true,
    template: `
        <svg
            [class]="styleClass()"
            class="absolute xl:block hidden [&_stop]:[stop-color:var(--p-surface-200)] dark:[&_stop]:[stop-color:var(--p-surface-800)] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="353"
            height="374"
            viewBox="0 0 353 374"
            fill="none"
        >
            <path
                d="M352.667 3C352.667 1.52722 351.473 0.333313 350 0.333313C348.527 0.333313 347.333 1.52722 347.333 3C347.333 4.47275 348.527 5.66666 350 5.66666C351.473 5.66666 352.667 4.47275 352.667 3ZM-164.353 372.646C-164.549 372.841 -164.549 373.158 -164.354 373.353C-164.159 373.549 -163.842 373.549 -163.647 373.354L-164.353 372.646ZM199.473 10.018L199.119 9.66418L199.473 10.018ZM350 2.5H216.432V3.5H350V2.5ZM199.119 9.66418L-164.353 372.646L-163.647 373.354L199.826 10.3718L199.119 9.66418ZM216.432 2.5C209.94 2.5 203.713 5.07669 199.119 9.66418L199.826 10.3718C204.232 5.97153 210.205 3.5 216.432 3.5V2.5Z"
                fill="url(#paint0_linear_6195_4459)"
            />
            <defs>
                <linearGradient id="paint0_linear_6195_4459" x1="-164" y1="188" x2="350" y2="188" gradientUnits="userSpaceOnUse">
                    <stop stop-opacity="0" />
                    <stop offset="0.095" />
                </linearGradient>
            </defs>
        </svg>
    `
})
export class SurfaceLine {
    styleClass = input<string>('', { alias: 'class' });
}
