import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalBalance, CurrencyChange, CurrencyChangeData, Overview, CreditCards, GlobalTransfer, CreditScore, AccountTransactions } from './components';

@Component({
    selector: 'app-banking',
    standalone: true,
    imports: [CommonModule, TotalBalance, CurrencyChange, Overview, CreditCards, GlobalTransfer, CreditScore, AccountTransactions],
    template: `
        <div class="grid grid-cols-12 gap-4">
            <div total-balance></div>
            <div class="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                @for (item of currencyChange(); track item.currency) {
                    <div currency-change [data]="item"></div>
                }
            </div>
            <div overview></div>
            <div credit-cards></div>
            <div global-transfer></div>
            <div credit-score></div>
            <div account-transactions></div>
        </div>
    `
})
export class BankingDashboard {
    currencyChange = signal<CurrencyChangeData[]>([
        {
            currency: 'USD',
            change: 72,
            increase: true,
            value: 178942.11,
            comparedToLastMonth: 48157.94
        },
        {
            currency: 'EUR',
            change: 10,
            increase: true,
            value: 93942.62,
            comparedToLastMonth: 12163.11
        },
        {
            currency: 'GBP',
            change: 5,
            increase: true,
            value: 17942.33,
            comparedToLastMonth: 2983.74
        },
        {
            currency: 'TRY',
            change: 12,
            increase: false,
            value: 142409.01,
            comparedToLastMonth: 134023.012
        }
    ]);
}
