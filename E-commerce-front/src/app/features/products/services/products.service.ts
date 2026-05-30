import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Product } from '@features/products/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = inject(ApiService);

  getProduct(): Observable<Product[]> {
    return this.api.get<Product[]>('product');
  }
}
