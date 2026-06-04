import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastSeverity } from './toast.component';

/**
 * Toast Service for easy notification management across the app
 * Inject this service in any component and use toast methods
 *
 * USAGE:
 * constructor(private toastService: ToastService) {}
 *
 * this.toastService.success('Success!', 'Data saved');
 * this.toastService.error('Error!', 'Something went wrong');
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService, { optional: true });

  /**
   * Show a toast notification
   */
  show(severity: ToastSeverity, summary: string, detail: string, life = 3000): void {
    if (!this.messageService) {
      console.warn(
        'ToastService: MessageService not provided. Ensure AppToastComponent is in your app root.',
      );
      return;
    }
    this.messageService.add({
      severity,
      summary,
      detail,
      life,
    });
  }

  success(summary: string, detail: string, life = 3000): void {
    this.show('success', summary, detail, life);
  }

  error(summary: string, detail: string, life = 3000): void {
    this.show('error', summary, detail, life);
  }

  warn(summary: string, detail: string, life = 3000): void {
    this.show('warn', summary, detail, life);
  }

  info(summary: string, detail: string, life = 3000): void {
    this.show('info', summary, detail, life);
  }

  clear(): void {
    this.messageService?.clear();
  }
}
