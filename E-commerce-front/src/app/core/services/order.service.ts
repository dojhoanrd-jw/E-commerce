import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CreateOrderItem, Order } from '@core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);

  createOrder(items: CreateOrderItem[]): Observable<Order> {
    return this.api.post<Order>('order', { items });
  }

  getMyOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('order/mine');
  }

  getById(id: number): Observable<Order> {
    return this.api.get<Order>(`order/${id}`);
  }

  requestReturn(id: number, reason: string): Observable<void> {
    return this.api.post<void>(`order/${id}/return`, { reason });
  }

  resolveReturn(id: number, approve: boolean): Observable<void> {
    return this.api.put<void>(`order/${id}/return`, { approve });
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.api.getBlob(`order/${id}/invoice`);
  }
}
