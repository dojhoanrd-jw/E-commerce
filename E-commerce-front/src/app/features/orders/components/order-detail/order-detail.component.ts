import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '@core/services/order.service';
import { Order } from '@core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
  `]
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);

  readonly steps = ['Pending', 'Shipped', 'Delivered'];
  readonly currentStep = computed(() => {
    const status = this.order()?.status;
    if (status === 'Cancelled') {
      return -1;
    }
    return this.steps.indexOf(status ?? '');
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getById(id).subscribe({
      next: (o) => {
        this.order.set(o);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
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
