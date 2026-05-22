import { Injectable, inject } from '@angular/core';
import { QueryClient, injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { JournalFacadeService } from './journal-facade.service';
import { LoggerService } from '@app/core/services/logger.service';
import { ToastService } from '@app/shared/components/ui-base/toast.service';
import { CreateJournalEntryRequest } from '@app/core/models/journal.models';

const QUERY_KEY = ['journal-entries'];

@Injectable({ providedIn: 'root' })
export class JournalMutationService {
  private readonly facade = inject(JournalFacadeService);
  private readonly queryClient = inject(QueryClient);
  private readonly logger = inject(LoggerService);
  private readonly toast = inject(ToastService);

  private invalidate() {
    return this.queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }

  createMutation(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: [...QUERY_KEY, 'create'],
      mutationFn: (payload: CreateJournalEntryRequest) =>
        firstValueFrom(this.facade.create(payload)),
      onSuccess: async () => {
        this.toast.success('Success', 'Journal entry created');
        await this.invalidate();
        onSuccess?.();
      },
      onError: (err: unknown) => {
        this.toast.error('Error', 'Failed to create journal entry');
        onError?.(err);
      },
    }));
  }

  updateMutation(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: [...QUERY_KEY, 'update'],
      mutationFn: (p: { id: string; payload: Partial<CreateJournalEntryRequest> }) =>
        firstValueFrom(this.facade.update(p.id, p.payload)),
      onSuccess: async () => {
        this.toast.success('Success', 'Journal entry updated');
        await this.invalidate();
        onSuccess?.();
      },
      onError: (err: unknown) => {
        this.toast.error('Error', 'Failed to update journal entry');
        onError?.(err);
      },
    }));
  }

  postMutation(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: [...QUERY_KEY, 'post'],
      mutationFn: (id: string) => firstValueFrom(this.facade.post(id)),
      onSuccess: async () => {
        this.toast.success('Success', 'Journal entry posted');
        await this.invalidate();
        onSuccess?.();
      },
      onError: (err: unknown) => {
        this.toast.error('Error', 'Failed to post journal entry');
        onError?.(err);
      },
    }));
  }

  reverseMutation(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: [...QUERY_KEY, 'reverse'],
      mutationFn: (id: string) => firstValueFrom(this.facade.reverse(id)),
      onSuccess: async () => {
        this.toast.success('Success', 'Journal entry reversed');
        await this.invalidate();
        onSuccess?.();
      },
      onError: (err: unknown) => {
        this.toast.error('Error', 'Failed to reverse journal entry');
        onError?.(err);
      },
    }));
  }

  deleteMutation(onSuccess?: () => void, onError?: (e: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: [...QUERY_KEY, 'delete'],
      mutationFn: (id: string) => firstValueFrom(this.facade.delete(id)),
      onSuccess: async () => {
        this.toast.success('Success', 'Journal entry deleted');
        await this.invalidate();
        onSuccess?.();
      },
      onError: (err: unknown) => {
        this.toast.error('Error', 'Failed to delete journal entry');
        onError?.(err);
      },
    }));
  }
}
