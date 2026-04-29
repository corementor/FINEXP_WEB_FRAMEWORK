import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: '[app-profile]',
    standalone: true,
    imports: [CommonModule, RippleModule],
    template: `
        <button pRipple [class]="buttonClass">
            <i class="pi pi-cog"></i>
            <span>Settings</span>
        </button>
        <button pRipple [class]="buttonClass">
            <i class="pi pi-file"></i>
            <span>Terms of Usage</span>
        </button>
        <button pRipple [class]="buttonClass">
            <i class="pi pi-comments"></i>
            <span>Support</span>
        </button>
        <button pRipple [class]="buttonClass">
            <i class="pi pi-sign-in"></i>
            <span>Log Out</span>
        </button>
    `,
    host: {
        class: 'z-30 p-2 space-y-2 rounded-2xl bg-surface-0 dark:bg-surface-950 shadow-[0px_129.205px_36.493px_0px_rgba(44,54,87,0.00),_0px_82.849px_33.534px_0px_rgba(44,54,87,0.01),_0px_46.356px_27.616px_0px_rgba(44,54,87,0.03),_0px_20.712px_20.712px_0px_rgba(44,54,87,0.05),_0px_4.932px_11.836px_0px_rgba(44,54,87,0.06)] dark:shadow-stroke'
    }
})
export class AppProfile {
    styleClass = input<string>('');

    readonly buttonClass = 'w-full px-3 py-2 rounded-lg flex items-center gap-2 font-medium text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150';
}
