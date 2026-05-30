import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Product } from '@features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) { }

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
