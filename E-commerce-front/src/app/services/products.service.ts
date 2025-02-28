import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/product`; 

  constructor(private http: HttpClient) { }

  getProduct(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
