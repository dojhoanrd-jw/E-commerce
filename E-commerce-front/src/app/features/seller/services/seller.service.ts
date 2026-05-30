import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';

export interface MonthlySales {
  month: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  unitsSold: number;
}

export interface SellerDashboard {
  productsCount: number;
  unitsSold: number;
  revenue: number;
  salesByMonth: MonthlySales[];
  topProducts: TopProduct[];
}

@Injectable({ providedIn: 'root' })
export class SellerService {
  private readonly api = inject(ApiService);

  getDashboard(): Observable<SellerDashboard> {
    return this.api.get<SellerDashboard>('seller/dashboard');
  }
}
