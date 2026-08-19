import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDashboardSummary } from '@app/core/models';
import { FinanceDashboardFacadeService } from '@app/features/dashboard/services';
import { TotalBalance, CurrencyChange, Overview, CreditCards, GlobalTransfer, CreditScore, AccountTransactions } from './components';

@Component({
    selector: 'app-banking',
    standalone: true,
    imports: [CommonModule, TotalBalance, CurrencyChange, Overview, CreditCards, GlobalTransfer, CreditScore, AccountTransactions],
    template: `
        <div class="grid grid-cols-12 gap-4">
            <div total-balance [data]="summary()?.cashPosition ?? null"></div>
            <div class="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                @for (kpi of summary()?.kpis ?? []; track kpi.key) {
                    <div currency-change [data]="kpi" [currency]="currency()"></div>
                }
            </div>
            <div overview [data]="summary()?.overview ?? null" [currency]="currency()"></div>
            <div credit-cards [data]="summary()?.budgetExecution ?? []" [currency]="currency()"></div>
            <div global-transfer [data]="summary()?.pendingApprovals ?? null" [currency]="currency()"></div>
            <div credit-score [data]="summary()?.cashBreakdown ?? null" [currency]="currency()"></div>
            <div account-transactions [data]="summary()?.recentEntries ?? []" [currency]="currency()"></div>
        </div>
    `
})
export class BankingDashboard implements OnInit {
    private readonly financeDashboardFacade = inject(FinanceDashboardFacadeService);

    summary = signal<FinanceDashboardSummary | null>(null);

    ngOnInit(): void {
        this.financeDashboardFacade.loadSummary().subscribe((summary) => this.summary.set(summary));
    }

    currency(): string {
        return this.summary()?.currency ?? 'RWF';
    }
}
