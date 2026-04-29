import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { Avatar } from 'primeng/avatar';

interface NotificationItem {
    id: number;
    name: string;
    message: string;
    date: string;
    avatar: string;
    action: string | null;
    actionText?: string;
}

interface NotificationData {
    inbox: NotificationItem[];
    general: NotificationItem[];
    archived: NotificationItem[];
}

@Component({
    selector: '[app-notifications]',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButton, Avatar],
    template: `
        <div class="p-4 pl-6 flex items-center justify-between border-b">
            <span class="font-medium">Notifications</span>
            <button class="px-2 py-1 text-sm rounded-lg border hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">Mark all as read</button>
        </div>
        <div class="p-2 space-y-4">
            <p-selectbutton [options]="options" [(ngModel)]="selectedOption" optionLabel="name" optionValue="value" [allowEmpty]="false" class="w-full" styleClass="!w-full [&_button]:!flex-1" />
            @for (item of currentItems(); track item.id) {
                <div class="p-3 flex items-start gap-3 rounded-lg cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors duration-150">
                    <p-avatar [image]="item.avatar" styleClass="!w-10 !h-10 !rounded-md !overflow-hidden" />
                    <div class="flex-1 mt-0.5">
                        <div>
                            <div class="flex items-center justify-between gap-2">
                                <span>{{ item.name }}</span>
                                <span class="text-sm text-surface-500">{{ item.date }}</span>
                            </div>
                            <p class="mt-0.5 line-clamp-1 text-sm text-surface-500">
                                {{ item.message }}
                            </p>
                        </div>
                        @if (item.action === 'confirmation') {
                            <div class="mt-1 flex items-center gap-3">
                                <button class="cursor-pointer flex-1 landing-button-secondary">Cancel</button>
                                <button class="cursor-pointer flex-1 landing-button-primary">Confirm</button>
                            </div>
                        }
                        @if (item.action === 'warn') {
                            <div class="mt-1 flex items-start gap-2 p-2 pl-3 rounded-xl bg-orange-500/10">
                                <i class="pi pi-exclamation-triangle mt-1 text-orange-600"></i>
                                <p class="text-sm text-orange-600">{{ item.actionText }}</p>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    `,
    host: {
        '[class]': 'hostClass()'
    }
})
export class AppNotifications {
    styleClass = input<string>('');

    hostClass = computed(
        () =>
            (this.styleClass() ?? '') +
            ' rounded-2xl bg-surface-0 dark:bg-surface-950 shadow-[0px_129.205px_36.493px_0px_rgba(44,54,87,0.00),_0px_82.849px_33.534px_0px_rgba(44,54,87,0.01),_0px_46.356px_27.616px_0px_rgba(44,54,87,0.03),_0px_20.712px_20.712px_0px_rgba(44,54,87,0.05),_0px_4.932px_11.836px_0px_rgba(44,54,87,0.06)] dark:shadow-stroke'
    );

    options = [
        { name: 'Inbox', value: 'inbox' },
        { name: 'General', value: 'general' },
        { name: 'Archived', value: 'archived' }
    ];

    selectedOption = signal<keyof NotificationData>('inbox');

    currentItems = computed(() => this.data[this.selectedOption()]);

    data: NotificationData = {
        inbox: [
            {
                id: 1,
                name: 'Robert Fox',
                message: 'Your latest design is progressing well! However, you might want to experiment with more pastel tones in the color palette',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-m-1.jpg',
                action: null
            },
            {
                id: 2,
                name: 'Onyama Limba',
                message: "The animations you've created on Webflow are really smooth, but you may need to work on mobile compatibility. Also, double-check the functionality of the 'Confirm' and 'Cancel' buttons for this project",
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-m-2.jpg',
                action: 'confirmation'
            },
            {
                id: 3,
                name: 'Amy Elsner',
                message: 'I have some suggestions for the typography. You could use slightly larger fonts, especially for the headers, to improve readability.',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-f-1.jpg',
                action: null
            },
            {
                id: 4,
                name: 'Annette Black',
                message: 'The color harmony looks fantastic, but you might need to balance the button placement a bit more. Also, consider using warning icons for error messages in your design',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-f-2.jpg',
                action: 'warn',
                actionText: 'The visual balance and user experience of this section need careful attention.'
            }
        ],
        general: [
            {
                id: 2,
                name: 'Onyama Limba',
                message: "The animations you've created on Webflow are really smooth, but you may need to work on mobile compatibility. Also, double-check the functionality of the 'Confirm' and 'Cancel' buttons for this project",
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-m-2.jpg',
                action: 'confirmation'
            },
            {
                id: 3,
                name: 'Amy Elsner',
                message: 'I have some suggestions for the typography. You could use slightly larger fonts, especially for the headers, to improve readability.',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-f-1.jpg',
                action: null
            },
            {
                id: 4,
                name: 'Annette Black',
                message: 'The color harmony looks fantastic, but you might need to balance the button placement a bit more. Also, consider using warning icons for error messages in your design',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-f-2.jpg',
                action: 'warn',
                actionText: 'The visual balance and user experience of this section need careful attention.'
            }
        ],
        archived: [
            {
                id: 1,
                name: 'Robert Fox',
                message: 'Your latest design is progressing well! However, you might want to experiment with more pastel tones in the color palette',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-m-1.jpg',
                action: null
            },
            {
                id: 3,
                name: 'Amy Elsner',
                message: 'I have some suggestions for the typography. You could use slightly larger fonts, especially for the headers, to improve readability.',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-f-1.jpg',
                action: null
            },
            {
                id: 4,
                name: 'Annette Black',
                message: 'The color harmony looks fantastic, but you might need to balance the button placement a bit more. Also, consider using warning icons for error messages in your design',
                date: '2 hours ago',
                avatar: '/demo/images/avatar/avatar-square-f-2.jpg',
                action: 'warn',
                actionText: 'The visual balance and user experience of this section need careful attention.'
            }
        ]
    };
}
