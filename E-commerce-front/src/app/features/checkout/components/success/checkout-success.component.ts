import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '@core/services/payment.service';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-success.component.html',
  styles: [`
    .result {
      max-width: 460px;
      margin: 3rem auto;
      text-align: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 2.5rem 2rem;
      box-shadow: var(--shadow-sm);
    }
    .result__icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result h1 { margin: 0 0 0.5rem; letter-spacing: -0.02em; }
    .result p { color: var(--color-muted); margin-bottom: 1.5rem; }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly payment = inject(PaymentService);
  private readonly cart = inject(CartService);
  private readonly notification = inject(NotificationService);

  readonly state = signal<'loading' | 'success' | 'error'>('loading');

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.state.set('error');
      return;
    }

    this.payment.confirm(sessionId).subscribe({
      next: () => {
        this.cart.clear();
        this.state.set('success');
        this.notification.success('¡Pago confirmado! Tu orden fue creada.');
      },
      error: () => this.state.set('error')
    });
  }
}
