import { Component, input } from '@angular/core';

@Component({
    selector: 'email',
    standalone: true,
    template: `
        <svg [class]="styleClass()" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M2.00224 7.63308C2.06365 6.03042 3.3823 4.75 5 4.75H19C20.6177 4.75 21.9363 6.03042 21.9978 7.63308L12.4472 12.4084C12.1657 12.5491 11.8343 12.5491 11.5528 12.4084L2.00224 7.63308Z" />
            <path d="M2 9.86804V17.75C2 19.4069 3.34315 20.75 5 20.75H19C20.6569 20.75 22 19.4069 22 17.75V9.86803L13.3416 14.1972C12.497 14.6195 11.5029 14.6195 10.6583 14.1972L2 9.86804Z" />
        </svg>
    `
})
export class Email {
    styleClass = input<string>('', { alias: 'class' });
}
