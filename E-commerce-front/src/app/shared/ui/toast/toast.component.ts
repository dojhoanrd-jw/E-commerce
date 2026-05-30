import { Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of notification.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="notification.dismiss(toast.id)">
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" type="button" aria-label="Cerrar">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 1000;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 240px;
      max-width: 360px;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      animation: slide-in 0.2s ease;
    }
    .toast--success { background: #16a34a; }
    .toast--error   { background: #dc2626; }
    .toast--info    { background: #2563eb; }
    .toast__message { flex: 1; font-size: 0.9rem; }
    .toast__close {
      background: transparent;
      border: 0;
      color: #fff;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
    }
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  protected readonly notification = inject(NotificationService);
}
