import { Component, input } from '@angular/core';

@Component({
    selector: 'copy-icon',
    standalone: true,
    template: `
        <svg [class]="styleClass()" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.35215 2.33333C3.35215 1.32081 4.17297 0.5 5.18549 0.5H10.8522C11.8647 0.5 12.6855 1.32081 12.6855 2.33333V8.00667C12.6855 9.0192 11.8647 9.84 10.8522 9.84H10.0188V10.6667C10.0188 11.6792 9.19802 12.5 8.18549 12.5H2.51882C1.5063 12.5 0.685486 11.6792 0.685486 10.6667V5C0.685486 3.98748 1.5063 3.16667 2.51882 3.16667H3.35215V2.33333ZM10.0188 8.84V5C10.0188 3.98748 9.19802 3.16667 8.18549 3.16667H4.35215V2.33333C4.35215 1.87309 4.72525 1.5 5.18549 1.5H10.8522C11.3124 1.5 11.6855 1.87309 11.6855 2.33333V8.00667C11.6855 8.46693 11.3124 8.84 10.8522 8.84H10.0188Z"
                fill="#2563EB"
            />
        </svg>
    `
})
export class CopyIcon {
    styleClass = input<string>('');
}
