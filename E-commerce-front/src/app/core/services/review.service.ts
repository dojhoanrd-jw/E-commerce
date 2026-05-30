import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly api = inject(ApiService);

  getByProduct(productId: number): Observable<Review[]> {
    return this.api.get<Review[]>(`review/product/${productId}`);
  }

  create(productId: number, rating: number, comment: string): Observable<Review> {
    return this.api.post<Review>(`review/product/${productId}`, { rating, comment });
  }
}
