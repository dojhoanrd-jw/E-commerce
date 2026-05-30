import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { UserRole } from '@core/models/auth.model';
import { Order } from '@core/models/order.model';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  getUsers(): Observable<AdminUser[]> {
    return this.api.get<AdminUser[]>('users');
  }

  changeRole(id: number, role: UserRole): Observable<void> {
    return this.api.put<void>(`users/${id}/role`, { role });
  }

  deleteUser(id: number): Observable<void> {
    return this.api.delete<void>(`users/${id}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('order');
  }
}
