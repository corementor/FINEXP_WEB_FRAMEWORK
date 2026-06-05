import { Component, input } from '@angular/core';

@Component({
    selector: 'zentrailms',
    standalone: true,
    template: `
        <svg [class]="styleClass()" class="fill-surface-500" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.6666 29.6666C22.7668 29.6666 29.3333 23.1001 29.3333 14.9999C29.3333 6.89975 22.7668 0.333252 14.6666 0.333252C6.56642 0.333252 -6.10352e-05 6.89975 -6.10352e-05 14.9999C-6.10352e-05 23.1001 6.56642 29.6666 14.6666 29.6666ZM19.2421 7.16561C19.4648 6.37449 18.6971 5.90668 17.996 6.40621L8.20823 13.3789C7.44784 13.9207 7.56744 14.9999 8.3879 14.9999H10.9653V14.98H15.9885L11.8955 16.4241L10.0911 22.8343C9.86843 23.6254 10.6361 24.0932 11.3373 23.5936L21.125 16.6209C21.8854 16.0792 21.7657 14.9999 20.9454 14.9999H17.0368L19.2421 7.16561Z"
            />
        </svg>
    `
})
export class ZenTrailMs {
    styleClass = input<string>('', { alias: 'class' });
}
