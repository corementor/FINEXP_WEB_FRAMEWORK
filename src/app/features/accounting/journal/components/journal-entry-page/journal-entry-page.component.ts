import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_UI_COMPONENTS } from '@app/shared/components/ui-base';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { JournalFacadeService } from '../../services/journal-facade.service';
import { JournalMutationService } from '../../services/journal-mutation.service';
import { JournalEntry, CreateJournalEntryRequest } from '@app/core/models/journal.models';
import { JournalFormComponent } from '../journal-form/journal-form.component';

/**
 * Journal Entry Page — Create & Edit
 *
 * Route: /journal/new        → create mode
 * Route: /journal/:id/edit   → edit mode (DRAFT entries only)
 *
 * Accounting rules enforced:
 * - Only DRAFT entries can be edited; POSTED entries are immutable
 * - Corrections to posted entries require a reversal (done from the list)
 * - Double-entry balance (DR = CR) validated inside JournalFormComponent
 * - Fiscal period must be open
 */
@Component({
  selector: 'app-journal-entry-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ...APP_UI_COMPONENTS, JournalFormComponent],
  template: `
    <div class="space-y-6 p-6">

      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
        <button
          type="button"
          (click)="goBack()"
          class="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs"></i>
          Journal Entries
        </button>
        <i class="pi pi-chevron-right text-xs"></i>
        <span class="text-surface-900 dark:text-surface-0 font-medium">{{ pageTitle() }}</span>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoadingEntry" class="flex justify-center py-24">
        <app-spinner size="large" />
      </div>

      <!-- Load error -->
      <div
        *ngIf="loadError"
        class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-6 flex items-start gap-4"
        role="alert"
      >
        <i class="pi pi-exclamation-circle text-red-500 text-2xl mt-0.5"></i>
        <div>
          <p class="font-semibold text-red-700 dark:text-red-300">{{ loadError }}</p>
          <button
            type="button"
            (click)="goBack()"
            class="mt-3 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
          >
            Return to journal list
          </button>
        </div>
      </div>

      <!-- Form card -->
      <div *ngIf="!isLoadingEntry && !loadError" custom-card>
        <h3 card-title class="flex items-center gap-2">
          <i [class]="'pi ' + (isEditMode ? 'pi-file-edit' : 'pi-file-plus')"></i>
          {{ pageTitle() }}
          <span
            *ngIf="entry()?.referenceNumber"
            class="ml-2 font-mono text-sm font-normal text-surface-400"
          >
            {{ entry()?.referenceNumber }}
          </span>
        </h3>

        <!-- Non-DRAFT guard banner — shown when navigating to edit a posted/reversed entry -->
        <div
          *ngIf="entry() && entry()!.status !== 'DRAFT'"
          class="mx-6 mt-4 rounded-lg border border-amber-200 dark:border-amber-800
                 bg-amber-50 dark:bg-amber-950 px-4 py-3 flex items-center gap-3
                 text-sm text-amber-700 dark:text-amber-300"
          role="alert"
        >
          <i class="pi pi-lock text-amber-500"></i>
          <span>
            This entry is <strong>{{ entry()!.status }}</strong> and cannot be edited.
            Return to the list and use <strong>Reverse</strong> to create a correcting entry.
          </span>
        </div>

        <div class="p-6">
          <app-journal-form
            [entry]="entry()"
            [loading]="isMutating()"
            [submitLabel]="submitLabel()"
            (submitted)="onSubmit($event)"
            (cancelled)="goBack()"
          />
        </div>
      </div>

    </div>
  `,
})
export class JournalEntryPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(JournalFacadeService);
  private readonly mutations = inject(JournalMutationService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly entry = signal<JournalEntry | null>(null);
  isLoadingEntry = false;
  loadError: string | null = null;

  readonly createMutation = this.mutations.createMutation(() => {
    this.toast.success('Created', 'Journal entry saved as DRAFT.');
    this.router.navigate(['/journal']);
  });

  readonly updateMutation = this.mutations.updateMutation(() => {
    this.toast.success('Updated', 'Journal entry updated.');
    this.router.navigate(['/journal']);
  });

  get isEditMode(): boolean {
    return !!this.route.snapshot.paramMap.get('id');
  }

  readonly pageTitle = computed(() =>
    this.isEditMode ? 'Edit Journal Entry' : 'New Journal Entry',
  );

  readonly submitLabel = computed(() =>
    this.isEditMode ? 'Update Entry' : 'Create Entry',
  );

  readonly isMutating = computed(
    () => this.createMutation.isPending() || this.updateMutation.isPending(),
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoadingEntry = true;
    this.loadError = null;

    this.facade.getById(id).subscribe({
      next: (e) => {
        this.entry.set(e);
        this.isLoadingEntry = false;
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.loadError = err.message ?? 'Journal entry not found.';
        this.isLoadingEntry = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(payload: CreateJournalEntryRequest): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.updateMutation.mutate({ id, payload });
    } else {
      this.createMutation.mutate(payload);
    }
  }

  goBack(): void {
    this.router.navigate(['/journal']);
  }
}
