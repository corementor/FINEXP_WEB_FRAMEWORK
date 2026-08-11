import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCard } from '../../../../shared/components/ui/customcard';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { InputNumber } from 'primeng/inputnumber';
import { Divider } from 'primeng/divider';

@Component({
    selector: '[global-transfer]',
    standalone: true,
    imports: [CommonModule, FormsModule, CustomCard, ButtonModule, Menu, InputNumber, Divider],
    template: `
        <div custom-card>
            <h3 card-title>Global Transfer</h3>
            <div card-action>
                <p-button type="button" icon="pi pi-ellipsis-h" (click)="menu.toggle($event)" severity="secondary" [text]="true" />
                <p-menu #menu [model]="menuItems()" [popup]="true" />
            </div>
            <div>
                <div class="p-4">
                    <div class="text-sm font-medium mb-2">Input Amount</div>
                    <p-inputnumber [(ngModel)]="inputAmount" mode="currency" [currency]="inputCurrency()" locale="en-US" [fluid]="true" />
                    <div class="my-4 flex items-center gap-2">
                        <p-divider styleClass="!flex-1" />
                        <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-stroke">
                            <i class="pi pi-arrow-right-arrow-left !text-xs"></i>
                        </div>
                        <p-divider styleClass="!flex-1" />
                    </div>
                    <p-inputnumber [(ngModel)]="outputAmount" mode="currency" [currency]="outputCurrency()" locale="en-US" [fluid]="true" />
                    <div class="mt-8 space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="text-surface-500">Current Rate</div>
                            <div class="font-medium">1 {{ inputCurrency() }} = {{ currentRate().toFixed(4) }} {{ outputCurrency() }}</div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-surface-500">Transfer Fee</div>
                            <div class="font-medium">{{ transferFee().toFixed(2) }} {{ inputCurrency() }}</div>
                        </div>
                    </div>
                </div>
                <div class="border-t p-4 flex items-center justify-between">
                    <div>
                        <div class="text-surface-500">Total you pay</div>
                        <div class="font-medium mt-1">{{ totalPay().toFixed(2) }} {{ inputCurrency() }}</div>
                    </div>
                    <p-button label="Convert" icon="pi pi-replay" />
                </div>
            </div>
        </div>
    `,
    host: {
        class: 'rounded-2xl flex flex-col overflow-hidden col-span-12 xl:col-span-4 row-span-1'
    }
})
export class GlobalTransfer {
    inputCurrency = signal('EUR');
    outputCurrency = signal('USD');
    inputAmount = signal(0);
    outputAmount = signal(0);
    currentRate = signal(0.9235);
    transferFee = signal(1.32);

    totalPay = computed(() => this.inputAmount() + this.transferFee());

    menuItems = signal([
        {
            label: 'Options',
            items: [
                { label: 'Refresh', icon: 'pi pi-refresh' },
                { label: 'Export', icon: 'pi pi-upload' }
            ]
        }
    ]);

    private isUpdatingInput = false;
    private isUpdatingOutput = false;

    constructor() {
        effect(() => {
            const input = this.inputAmount();
            if (this.isUpdatingOutput) return;

            this.isUpdatingInput = true;
            if (this.inputCurrency() === 'EUR' && this.outputCurrency() === 'USD') {
                this.outputAmount.set(input / this.currentRate());
            } else if (this.inputCurrency() === 'USD' && this.outputCurrency() === 'EUR') {
                this.outputAmount.set(input * this.currentRate());
            }
            this.isUpdatingInput = false;
        });

        effect(() => {
            const output = this.outputAmount();
            if (this.isUpdatingInput) return;

            this.isUpdatingOutput = true;
            if (this.inputCurrency() === 'EUR' && this.outputCurrency() === 'USD') {
                this.inputAmount.set(output * this.currentRate());
            } else if (this.inputCurrency() === 'USD' && this.outputCurrency() === 'EUR') {
                this.inputAmount.set(output / this.currentRate());
            }
            this.isUpdatingOutput = false;
        });
    }
}
