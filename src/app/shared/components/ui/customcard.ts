import { Component, computed, input } from '@angular/core';

@Component({
    selector: '[custom-card]',
    standalone: true,
    template: `
        <div [class]="headerClass()">
            <h3 [class]="titleClass()">
                <ng-content select="[card-title]" />
            </h3>
            <div [class]="actionClass()">
                <ng-content select="[card-action]" />
            </div>
        </div>
        <div [class]="contentClass()">
            <ng-content />
        </div>
    `,
    host: {
        '[class]': 'hostClass()'
    }
})
export class CustomCard {
    styleClass = input<string>('');
    headerStyleClass = input<string>('');
    titleStyleClass = input<string>('');
    actionStyleClass = input<string>('');
    contentStyleClass = input<string>('');

    hostClass = computed(() => `flex flex-col rounded-2xl border bg-surface-0 dark:bg-surface-950 ${this.styleClass()}`);
    headerClass = computed(() => `max-h-14 pl-5 pr-3 py-3 flex items-center justify-between gap-2 border-b ${this.headerStyleClass()}`);
    titleClass = computed(() => `text-lg font-medium ${this.titleStyleClass()}`);
    actionClass = computed(() => `flex items-center justify-between gap-4 ${this.actionStyleClass()}`);
    contentClass = computed(() => `flex-1 overflow-auto  ${this.contentStyleClass()}`);
}
