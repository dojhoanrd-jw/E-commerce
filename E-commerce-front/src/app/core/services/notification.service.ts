import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '@core/models/toast.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private nextId = 0;
  private readonly defaultDuration = 4000;

  success(message: string, duration = this.defaultDuration): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = this.defaultDuration): void {
    this.show('error', message, duration);
  }

  info(message: string, duration = this.defaultDuration): void {
    this.show('info', message, duration);
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(type: ToastType, message: string, duration: number): void {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }
}
