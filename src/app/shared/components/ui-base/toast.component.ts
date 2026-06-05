import { Component, Input, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

/**
 * AppToast Component
 *
 * SOURCE: PrimeNG Toast (primeng/toast)
 * - PrimeNG v21.0.2
 * - License: MIT
 * - Reference: https://primeng.org/toast
 *
 * WRAPPER PURPOSE:
 * This component wraps PrimeNG's p-toast to provide a simplified,
 * props-only API that abstracts PrimeNG internals.
 *
 * USAGE (with ToastService):
 * constructor(private toastService: ToastService) {}
 *
 * this.toastService.success('Success!', 'Operation completed');
 * this.toastService.error('Error!', 'Something went wrong');
 * this.toastService.warn('Warning', 'Please review');
 * this.toastService.info('Info', 'FYI');
 *
 * STYLING:
 * Uses Avalon theme colors and PrimeUX design system.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ToastModule, CommonModule],
  template: ` <p-toast position="top-right" [baseZIndex]="9999" [breakpoints]="breakpoints" /> `,
})
export class AppToastComponent {
  @Input() breakpoints = { '640px': { width: '100vw', right: '0', left: '0' } };

  messageService = inject(MessageService);

  /**
   * Show a toast notification
   * @param severity 'success' | 'info' | 'warn' | 'error'
   * @param summary Title of the toast
   * @param detail Message content
   * @param life Duration in milliseconds (default: 3000)
   */
  show(severity: ToastSeverity, summary: string, detail: string, life = 3000): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      life,
    });
  }

  /**
   * Show success toast
   */
  success(summary: string, detail: string, life = 3000): void {
    this.show('success', summary, detail, life);
  }

  /**
   * Show error toast
   */
  error(summary: string, detail: string, life = 3000): void {
    this.show('error', summary, detail, life);
  }

  /**
   * Show warning toast
   */
  warn(summary: string, detail: string, life = 3000): void {
    this.show('warn', summary, detail, life);
  }

  /**
   * Show info toast
   */
  info(summary: string, detail: string, life = 3000): void {
    this.show('info', summary, detail, life);
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.messageService.clear();
  }
}
