import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '@core/services/order.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Order } from '@core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styles: [`
    .order-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; }
    .order-head h1 { margin: 0; }
    .order-date { color: var(--color-muted); }
    .cancelled {
      background: rgba(220, 38, 38, 0.1);
      color: var(--color-error);
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    .progress {
      display: flex;
      justify-content: space-between;
      margin: 1.5rem 0 2.5rem;
      position: relative;
    }
    .progress::before {
      content: '';
      position: absolute;
      top: 17px;
      left: 10%;
      right: 10%;
      height: 3px;
      background: var(--color-border);
      z-index: 0;
    }
    .progress__step {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      color: var(--color-muted);
      font-size: 0.85rem;
      font-weight: 600;
    }
    .progress__dot {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-surface);
      border: 3px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .progress__step.done { color: var(--color-primary-dark); }
    .progress__step.done .progress__dot {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .order-total {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 1px solid var(--color-border);
      font-size: 1.15rem;
    }
    .order-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
    .ghost-btn {
      border: 1.5px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-ink);
      font-family: inherit;
      font-weight: 600;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .ghost-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary-dark); }
    .ghost-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .return-box {
      margin-top: 1.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.1rem 1.25rem;
      background: var(--color-bg);
    }
    .return-box h3 { margin: 0 0 0.6rem; font-size: 1rem; }
    .return-box textarea {
      width: 100%;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 0.6rem;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 0.6rem;
    }
    .return-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
    }
    .return-badge--requested { background: rgba(244, 162, 97, 0.18); color: #b5651d; }
    .return-badge--refunded { background: rgba(42, 157, 143, 0.15); color: var(--color-primary-dark); }
    .return-badge--rejected { background: rgba(220, 38, 38, 0.12); color: var(--color-error); }
    .return-reason { color: var(--color-muted); font-size: 0.9rem; margin: 0.5rem 0 0; }
    .admin-actions { display: flex; gap: 0.6rem; margin-top: 0.8rem; }
    .btn-approve, .btn-reject {
      border: 0; border-radius: var(--radius-sm); padding: 0.55rem 1rem;
      font-family: inherit; font-weight: 700; cursor: pointer; color: #fff;
    }
    .btn-approve { background: var(--color-primary); }
    .btn-reject { background: var(--color-error); }
    .btn-approve:disabled, .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  private orderId = 0;

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly working = signal(false);
  readonly showReturnForm = signal(false);
  readonly returnReason = signal('');

  readonly steps = ['Pending', 'Shipped', 'Delivered'];
  readonly currentStep = computed(() => {
    const status = this.order()?.status;
    if (status === 'Cancelled') {
      return -1;
    }
    return this.steps.indexOf(status ?? '');
  });

  readonly isAdmin = computed(() => this.auth.currentUser()?.role === 'Admin');

  readonly canRequestReturn = computed(() => {
    const o = this.order();
    return !!o && (o.status === 'Shipped' || o.status === 'Delivered') && o.returnStatus === 'None';
  });

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  private load(): void {
    this.orderService.getById(this.orderId).subscribe({
      next: (o) => {
        this.order.set(o);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  downloadInvoice(): void {
    this.orderService.downloadInvoice(this.orderId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${this.orderId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.notification.error('No se pudo generar la factura.')
    });
  }

  submitReturn(): void {
    const reason = this.returnReason().trim();
    if (reason.length === 0) {
      return;
    }
    this.working.set(true);
    this.orderService.requestReturn(this.orderId, reason).subscribe({
      next: () => {
        this.notification.success('Solicitud de devolución enviada');
        this.showReturnForm.set(false);
        this.returnReason.set('');
        this.working.set(false);
        this.load();
      },
      error: () => this.working.set(false)
    });
  }

  resolveReturn(approve: boolean): void {
    this.working.set(true);
    this.orderService.resolveReturn(this.orderId, approve).subscribe({
      next: () => {
        this.notification.success(approve ? 'Devolución aprobada y reembolsada' : 'Devolución rechazada');
        this.working.set(false);
        this.load();
      },
      error: () => this.working.set(false)
    });
  }

  returnStatusLabel(status: string): string {
    switch (status) {
      case 'Requested':
        return 'Devolución solicitada';
      case 'Refunded':
        return 'Reembolsado';
      case 'Rejected':
        return 'Devolución rechazada';
      default:
        return '';
    }
  }

  stepLabel(step: string): string {
    switch (step) {
      case 'Pending':
        return 'Pendiente';
      case 'Shipped':
        return 'Enviado';
      default:
        return 'Entregado';
    }
  }
}
