import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CreateOrderItem, Order } from '@core/models/order.model';

interface CheckoutResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly api = inject(ApiService);

  createCheckout(items: CreateOrderItem[]): Observable<CheckoutResponse> {
    return this.api.post<CheckoutResponse>('payment/checkout', { items });
  }

  confirm(sessionId: string): Observable<Order> {
    return this.api.post<Order>('payment/confirm', { sessionId });
  }
}
