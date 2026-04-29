import { Component, input } from '@angular/core';

@Component({
    selector: 'wavelength',
    standalone: true,
    template: `
        <svg [class]="styleClass()" class="fill-surface-500" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 0.333252C6.8998 0.333252 0.333313 6.89974 0.333313 14.9999C8.43349 14.9999 15 8.43343 15 0.333252Z" />
            <path d="M15.0003 29.6664C23.1005 29.6664 29.667 23.0999 29.667 14.9998C21.5668 14.9998 15.0003 21.5662 15.0003 29.6664Z" />
            <path d="M15.0003 0.333252C23.1005 0.333252 29.667 6.89974 29.667 14.9999C21.5668 14.9999 15.0003 8.43343 15.0003 0.333252Z" />
            <path d="M15 29.6664C6.8998 29.6664 0.333312 23.0999 0.333313 14.9998C8.43349 14.9998 15 21.5662 15 29.6664Z" />
        </svg>
    `
})
export class Wavelength {
    styleClass = input<string>('', { alias: 'class' });
}
