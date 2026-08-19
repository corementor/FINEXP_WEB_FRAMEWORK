import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LoggerService } from './logger.service';

/**
 * File Download Service
 * Saves a binary payload received from the backend to the user's disk.
 * Safe to call during server side rendering, where it is a no-op.
 */
@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly logger = inject(LoggerService);

  saveBlob(blob: Blob, fileName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.logger.warn('File download skipped, not running in a browser', { fileName });
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
