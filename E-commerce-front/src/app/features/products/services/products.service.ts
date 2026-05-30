import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Product, ProductPayload, ProductSuggestion } from '@features/products/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = inject(ApiService);

  getProduct(): Observable<Product[]> {
    return this.api.get<Product[]>('product');
  }

  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`product/${id}`);
  }

  search(term: string, limit = 6): Observable<ProductSuggestion[]> {
    return this.api.get<ProductSuggestion[]>(`product/search?q=${encodeURIComponent(term)}&limit=${limit}`);
  }

  getMine(): Observable<Product[]> {
    return this.api.get<Product[]>('product/mine');
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.api.post<Product>('product', payload);
  }

  update(id: number, payload: ProductPayload): Observable<void> {
    return this.api.put<void>(`product/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`product/${id}`);
  }
}
