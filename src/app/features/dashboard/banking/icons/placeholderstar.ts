import { Component, input } from '@angular/core';

@Component({
    selector: 'placeholder-star-icon',
    standalone: true,
    template: `
        <svg [class]="styleClass()" class="fill-surface-950 dark:fill-surface-0" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none">
            <path
                d="M3.77238 6.99178H4.15429C4.21794 6.60077 4.39071 6.17339 4.6817 5.70964C5.26366 4.79123 6.43668 3.89101 7.44602 3.68186V3.29995C6.9459 3.19083 6.45487 2.9635 5.98202 2.62705C5.01814 1.94507 4.30888 0.926631 4.15429 0.00822067L3.77238 0.00822067C3.68145 0.490159 3.4723 0.953911 3.14495 1.42676C2.49933 2.36335 1.48999 3.05443 0.462463 3.29995L0.462463 3.68186C0.980774 3.79098 1.50818 4.04559 2.02649 4.4366C3.0813 5.2277 3.63598 6.20977 3.77238 6.99178Z"
            />
        </svg>
    `,
    host: {
        class: 'inline-flex'
    }
})
export class PlaceholderStarIcon {
    styleClass = input<string>('');
}
