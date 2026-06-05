import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logLevel = environment.logLevel as LogLevel;

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private currentLevel = this.levels[this.logLevel];

  debug(message: string, data?: any): void {
    if (this.levels['debug'] >= this.currentLevel) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.levels['info'] >= this.currentLevel) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.levels['warn'] >= this.currentLevel) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message: string, error?: any): void {
    if (this.levels['error'] >= this.currentLevel) {
      console.error(`[ERROR] ${message}`, error);
    }
  }
}
