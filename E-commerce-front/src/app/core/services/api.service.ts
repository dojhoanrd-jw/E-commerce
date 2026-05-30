import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.url(endpoint));
  }

  getBlob(endpoint: string): Observable<Blob> {
    return this.http.get(this.url(endpoint), { responseType: 'blob' });
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(endpoint), body);
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(endpoint), body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.url(endpoint));
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace(/^\//, '')}`;
  }
}
